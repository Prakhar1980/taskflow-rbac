import { connectDatabase } from '../config/database';
import { env } from '../config/env';
import { UserRepository } from '../repositories/UserRepository';
import { logger } from './logger';

const seedAdmin = async () => {
  if (!env.adminEmail || !env.adminPassword) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
  }

  await connectDatabase();
  const repository = new UserRepository();
  const existingAdmin = await repository.findByEmail(env.adminEmail);

  if (existingAdmin) {
    logger.info('Admin user already exists');
    process.exit(0);
  }

  await repository.create({
    name: 'System Admin',
    email: env.adminEmail,
    password: env.adminPassword,
    role: 'admin'
  });

  logger.info(`Admin user created: ${env.adminEmail}`);
  process.exit(0);
};

seedAdmin().catch((error) => {
  logger.error(error);
  process.exit(1);
});
