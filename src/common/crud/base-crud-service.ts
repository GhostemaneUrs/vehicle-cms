import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository, DataSource, QueryRunner, In, EntityTarget } from 'typeorm';
import { plainToClass } from 'class-transformer';

export class BaseCrudService<Entity, CreateDto, UpdateDto, ReadDto> {
  constructor(
    protected readonly genericRepository: Repository<Entity>,
    protected readonly dataSource: DataSource,
    protected readonly entityCls: EntityTarget<Entity>,
    protected readonly readDtoCls: new (...args: any[]) => ReadDto,
  ) {}

  async findAll(): Promise<ReadDto[]> {
    const values = await this.genericRepository.find();

    return values.map((e) => this.transformToDto(e));
  }

  async findOne(id: string): Promise<ReadDto> {
    const value = await this.genericRepository.findOne({
      where: { id } as any,
    });

    if (!value) throw new NotFoundException(`Entity not found`);

    return this.transformToDto(value);
  }

  async create(dto: CreateDto): Promise<ReadDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const value = await this.makeEntity(dto, queryRunner);

      const saved = await queryRunner.manager.save(value);

      await queryRunner.commitTransaction();

      return this.transformToDto(saved);
    } catch (err) {
      console.log('🚀 ~ BaseCrudService<Entity, ~ create ~ err:', err);
      await queryRunner.rollbackTransaction();
      throw err instanceof ConflictException || err instanceof NotFoundException
        ? err
        : new ConflictException(err.message);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: string, dto: UpdateDto): Promise<ReadDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const existing = await queryRunner.manager.findOne(this.entityCls, {
        where: { id } as any,
      });

      if (!existing) throw new NotFoundException(`Entity not found`);

      const value = await this.makeEntity(dto, queryRunner, existing);

      const saved = await queryRunner.manager.save(value);

      await queryRunner.commitTransaction();

      return this.transformToDto(saved);
    } catch (err) {
      console.log('🚀 ~ BaseCrudService<Entity, ~ update ~ err:', err);
      await queryRunner.rollbackTransaction();
      throw err instanceof NotFoundException
        ? err
        : new ConflictException(err.message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<void> {
    const e = await this.genericRepository.findOne({ where: { id } as any });

    if (!e) throw new NotFoundException(`Entity not found`);

    await this.genericRepository.remove(e);
  }

  protected transformToDto(e: Entity): ReadDto {
    return plainToClass(this.readDtoCls, e);
  }

  private async makeEntity(
    dto: CreateDto | UpdateDto,
    queryRunner: QueryRunner,
    existing?: Entity,
  ): Promise<Entity> {
    let ent: any;
    if (existing) {
      Object.assign((ent = existing), dto);
    } else {
      ent = queryRunner.manager.create(this.entityCls, dto as any);
    }

    await this.assignRelations(ent, dto, queryRunner);
    return ent;
  }

  protected async assignRelations(
    entity: any,
    dto: any,
    queryRunner: QueryRunner,
  ) {
    for (const [k, v] of Object.entries(dto)) {
      if (k.endsWith('Id') && typeof v === 'string') {
        const rel = k.replace(/Id$/, '');

        const obj = await queryRunner.manager.findOne(rel, {
          where: { id: v },
        });

        if (!obj) throw new NotFoundException(`${rel} not found`);

        entity[rel] = obj;
      }
      if (k.endsWith('Ids') && Array.isArray(v)) {
        const rel = k.replace(/Ids$/, '');

        const items = await queryRunner.manager.find(rel, {
          where: { id: In(v) } as any,
        });

        if (items.length !== v.length)
          throw new NotFoundException(`Some ${rel} not found`);
        entity[rel] = items;
      }
    }
  }
}
