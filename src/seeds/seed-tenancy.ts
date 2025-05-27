import 'reflect-metadata';
import { PublicDataSourceRuntime } from '../database/public/base-data-source.runtime';

export async function seedTenancy(): Promise<void> {
  const tenantName = process.env.TENANCY;
  if (!tenantName) {
    console.warn('⚠️  No TENANCY in .env, skipping seedTenancy');
    return;
  }
  await PublicDataSourceRuntime.initialize();
  console.log(`➡️  Seeding tenancy "${tenantName}"…`);
  await PublicDataSourceRuntime.query(
    `INSERT INTO tenancy(id,name,created_at)
         VALUES (uuid_generate_v4(), $1, NOW())
      ON CONFLICT (name) DO NOTHING;`,
    [tenantName],
  );
  console.log(`✅  Seeded tenancy "${tenantName}".`);
  await PublicDataSourceRuntime.destroy();
}
