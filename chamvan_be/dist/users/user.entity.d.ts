export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export declare class User {
    id: string;
    fullName?: string;
    email: string;
    password: string;
    phone?: string;
    dob?: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    tokenVersion: number;
}
