import 'reflect-metadata';
import { spawnSync } from 'child_process';
import PublicDataSource from '../public/base-data-source.cli';

async function main() {
  await PublicDataSource.initialize();
  console.log('\n⏳ Generating GENERAL (public) migrations');
  const generalName = `InitTenancyTable_${Date.now()}`;
  spawnSync(
    'npx',
    [
      'typeorm-ts-node-commonjs',
      'migration:generate',
      `src/database/general-migrations/${generalName}`,
      '--dataSource',
      'src/database/public/base-data-source.cli.ts',
    ],
    { stdio: 'inherit', shell: true },
  );

  const tenants: { name: string }[] = await PublicDataSource.query(
    'SELECT name FROM tenancy',
  );
  for (const { name } of tenants) {
    const schema = `t_${name}`;
    console.log(`\n⏳ Generating TENANT "${schema}" migrations`);
    spawnSync('mkdir', ['-p', `src/database/migrations/${schema}`], {
      stdio: 'inherit',
      shell: true,
    });
    spawnSync(
      'npx',
      [
        'typeorm-ts-node-commonjs',
        'migration:generate',
        `src/database/migrations/${schema}/${name}`,
        '--dataSource',
        'src/database/tenancy/data-source.cli.ts',
        '--',
        name,
      ],
      { stdio: 'inherit', shell: true },
    );
  }

  console.log('\n✅ All migrations generated.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
