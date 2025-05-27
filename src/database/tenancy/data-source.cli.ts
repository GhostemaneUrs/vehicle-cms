import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { createTenantDataSource } from './data-source';
dotenv.config();

const tenantName = process.argv[process.argv.length - 1];
if (!tenantName) {
  console.error('❌ Falta nombre de tenant al final');
  process.exit(1);
}
export default createTenantDataSource(`t_${tenantName}`, true);
