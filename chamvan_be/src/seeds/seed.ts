// chamvan_be/src/seeds/seed.ts
import { DataSource } from "typeorm";
import { User, UserRole } from "../users/user.entity";
import * as bcrypt from "bcryptjs";

function requireEnv(key: string): string {
  const v = process.env[key];
  if (!v || !String(v).trim()) {
    throw new Error(`[seed] Missing env: ${key}`);
  }
  return String(v).trim();
}

/**
 * Parse role an toàn:
 * - Nếu enum có đúng giá trị đó -> dùng
 * - Nếu không có -> fallback ADMIN
 *
 * Hỗ trợ các cách nhập:
 *   SEED_ADMIN_ROLE=admin
 *   SEED_ADMIN_ROLE=ADMIN
 *   SEED_ADMIN_ROLE=UserRole.ADMIN (không khuyến nghị nhưng vẫn xử lý)
 */
function parseRoleSafe(input: string): UserRole {
  const raw = (input || "").trim();

  // Chuẩn hoá: "admin", "ADMIN", "UserRole.ADMIN"
  const key = raw.replace(/^UserRole\./i, "").toUpperCase();

  // Nếu enum dùng dạng string values, Object.values(UserRole) sẽ là ["admin","user",...]
  const values = Object.values(UserRole) as string[];

  // 1) Nếu user nhập đúng theo VALUE của enum (ví dụ "admin") -> match trực tiếp
  const lower = key.toLowerCase();
  const matchedByValue = values.find((v) => String(v).toLowerCase() === lower);
  if (matchedByValue) return matchedByValue as unknown as UserRole;

  // 2) Nếu user nhập theo KEY của enum (ví dụ "ADMIN") -> map key -> value
  const mapped = (UserRole as any)[key];
  if (mapped && values.includes(mapped)) return mapped as UserRole;

  // fallback
  return UserRole.ADMIN;
}

export async function seed(dataSource: DataSource) {
  // ✅ Chỉ seed khi bật cờ
  const enabled = String(process.env.SEED_ADMIN_ENABLED || "")
    .trim()
    .toLowerCase() === "true";

  if (!enabled) {
    console.log("ℹ Seed skipped (SEED_ADMIN_ENABLED != true)");
    return;
  }

  const userRepo = dataSource.getRepository(User);

  const adminEmail = requireEnv("SEED_ADMIN_EMAIL");
  const adminPassword = requireEnv("SEED_ADMIN_PASSWORD");
  const adminFullName = (process.env.SEED_ADMIN_FULLNAME || "Admin").trim();
  const adminRoleInput = (process.env.SEED_ADMIN_ROLE || "admin").trim();
  const adminRole = parseRoleSafe(adminRoleInput);

  let admin = await userRepo.findOne({ where: { email: adminEmail } });

  if (!admin) {
    const hash = await bcrypt.hash(adminPassword, 10);

    admin = userRepo.create({
      fullName: adminFullName,
      email: adminEmail,
      password: hash,
      role: adminRole,
    });

    await userRepo.save(admin);

    // ✅ Không log password
    console.log(`✔ Admin created: ${adminEmail} (role=${adminRoleInput})`);
  } else {
    console.log(`ℹ Admin existed: ${adminEmail}`);
  }

  console.log("✔ Seed done");
}
