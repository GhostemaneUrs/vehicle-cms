import 'reflect-metadata';
import { seedTenancy } from './seed-tenancy';
import { seedRolesPermissions } from './seed-roles-permissions';

async function main() {
  console.log('🚀 Starting all seeds…');
  await seedTenancy();
  await seedRolesPermissions();
}

main().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
