import 'reflect-metadata';
import PublicDataSource from '../public/base-data-source.cli';
import { createTenantDataSource } from '../tenancy/data-source';
import type { DataSource } from 'typeorm';

async function bootstrap() {
  const [, , cmd] = process.argv;
  if (cmd !== 'up' && cmd !== 'down') {
    console.error('Uso: npm run db:migrate <up|down>');
    process.exit(1);
  }
  const isUp = cmd === 'up';

  await PublicDataSource.initialize();
  console.log(`\n--- Public migrations (${isUp ? 'up' : 'down'}) ---`);
  if (isUp) {
    const applied = await PublicDataSource.runMigrations();
    console.log(
      '  ✔ Applied in public:',
      applied.length ? applied.map((m) => m.name).join(', ') : 'none',
    );
  } else {
    await PublicDataSource.undoLastMigration();
    console.log('  ↶ Reverted one in public');
  }

  const tenants: { name: string }[] = await PublicDataSource.query(
    'SELECT name FROM tenancy',
  );
  for (const { name } of tenants) {
    const schema = `t_${name}`;
    console.log(
      `\n--- Tenant ${schema} migrations (${isUp ? 'up' : 'down'}) ---`,
    );
    const ds: DataSource = createTenantDataSource(schema, true);
    await ds.initialize();
    if (isUp) {
      const appl = await ds.runMigrations();
      console.log(
        '  ✔ Applied in',
        schema,
        ':',
        appl.length ? appl.map((m) => m.name).join(', ') : 'none',
      );
    } else {
      await ds.undoLastMigration();
      console.log('  ↶ Reverted one in', schema);
    }
    await ds.destroy();
  }

  await PublicDataSource.destroy();
  console.log('\n✅ ¡Todas las migraciones procesadas!');
  process.exit(0);
}

bootstrap().catch((e) => {
  console.error('Error en migrate.ts:', e);
  process.exit(1);
});
