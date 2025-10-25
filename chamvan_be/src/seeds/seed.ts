// chamvan_be/src/seeds/seed.ts
import { DataSource } from 'typeorm';
import { User, UserRole } from '../users/user.entity'; // dùng relative path
import * as bcrypt from 'bcryptjs';

export async function seed(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);

  const adminEmail = 'admin@chamvan.local';
  let admin = await userRepo.findOne({ where: { email: adminEmail } });

  if (!admin) {
    const hash = await bcrypt.hash('admin123', 10);

    const adminData: Partial<User> = {
      fullName: 'Admin',
      email: adminEmail,
      password: hash,
      role: UserRole.ADMIN,
    };

    admin = userRepo.create(adminData);
    await userRepo.save(admin);

    console.log('✔ Admin created: ', adminEmail, ' / pass: admin123');
  } else {
    console.log('ℹ Admin existed');
  }

  console.log('✔ Seed done');
}
