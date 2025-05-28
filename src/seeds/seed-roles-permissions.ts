import 'reflect-metadata';
import { PublicDataSourceRuntime } from '../database/public/base-data-source.runtime';
import { createTenantDataSourceRuntime } from '../database/tenancy/data-source.runtime';

export async function seedRolesPermissions() {
  await PublicDataSourceRuntime.initialize();
  const tenants: { name: string }[] = await PublicDataSourceRuntime.query(
    'SELECT name FROM tenancy',
  );

  for (const { name } of tenants) {
    const schema = `t_${name}`;
    console.log(`\n➡️  Seeding tenant "${name}" (schema: ${schema})`);

    const ds = createTenantDataSourceRuntime(schema);
    await ds.initialize();

    await ds.query(`SET search_path TO "${schema}", public;`);

    await ds.query(`
      INSERT INTO permissions(id, name, description, created_at)
      VALUES
        (uuid_generate_v4(), 'view_transfers', 'Can view transfer records', NOW()),
        (uuid_generate_v4(), 'create_transfers','Can create transfer records',NOW()),
        (uuid_generate_v4(), 'edit_transfers','Can edit transfer records',NOW()),
        (uuid_generate_v4(), 'delete_transfers','Can delete transfer records',NOW())
      ON CONFLICT (name) DO NOTHING;
    `);

    await ds.query(`
      INSERT INTO roles(id, name, description, created_at)
      VALUES
        (uuid_generate_v4(), 'admin','Administrator role',NOW()),
        (uuid_generate_v4(), 'manager','Manager role',NOW())
      ON CONFLICT (name) DO NOTHING;
    `);

    await ds.query(`
      INSERT INTO role_permissions(role_id, permission_id)
      SELECT r.id,p.id
      FROM roles r
      CROSS JOIN permissions p
      WHERE r.name='admin'
      ON CONFLICT DO NOTHING;
    `);

    await ds.query(`
      INSERT INTO role_permissions(role_id, permission_id)
      SELECT r.id,p.id
      FROM roles r
      JOIN permissions p ON p.name IN('view_transfers','create_transfers')
      WHERE r.name='manager'
      ON CONFLICT DO NOTHING;
    `);

    console.log(`✅  Tenant "${name}" seeded.`);
    await ds.destroy();
  }

  await PublicDataSourceRuntime.destroy();
}

if (require.main === module) {
  seedRolesPermissions()
    .then(() => {
      console.log('✅ seed-roles-permissions.js completado.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Error en seed-roles-permissions.js:', err);
      process.exit(1);
    });
}
