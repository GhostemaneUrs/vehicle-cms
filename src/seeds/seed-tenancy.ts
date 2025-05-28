import 'reflect-metadata';
import { PublicDataSourceRuntime } from '../database/public/base-data-source.runtime';

export async function seedTenancy(): Promise<void> {
  const tenantName = process.env.TENANCY;
  if (!tenantName) {
    console.warn('⚠️  No TENANCY en .env, saltando seedTenancy');
    return;
  }

  await PublicDataSourceRuntime.initialize();

  const schema = `t_${tenantName}`;
  console.log(`➡️  Creando schema "${schema}" si no existe…`);
  await PublicDataSourceRuntime.query(
    `CREATE SCHEMA IF NOT EXISTS "${schema}";`,
  );

  console.log(`➡️  Semillando tenancy "${tenantName}" en public.tenancy…`);
  await PublicDataSourceRuntime.query(
    `
    INSERT INTO tenancy(id, name, created_at)
      VALUES (uuid_generate_v4(), $1, NOW())
    ON CONFLICT (name) DO NOTHING;
    `,
    [tenantName],
  );

  console.log(`✅  Tenant "${tenantName}" semillado y schema listo.`);
  await PublicDataSourceRuntime.destroy();
}
