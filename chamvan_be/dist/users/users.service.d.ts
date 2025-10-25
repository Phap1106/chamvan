import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ListUsersQueryDto } from './dto/list-users.dto';
export declare class UsersService {
    private repo;
    constructor(repo: Repository<User>);
    assertExists(id: string): Promise<User>;
    countAdmins(): Promise<number>;
    private hashPassword;
    registerCustomer(dto: CreateUserDto): Promise<User>;
    adminCreate(dto: CreateUserDto & {
        role?: 'support_admin' | 'admin' | 'user';
    }): Promise<User>;
    findAll(q: ListUsersQueryDto): Promise<{
        items: User[];
        total: number;
        page: number;
        limit: number;
    }>;
    findPublicById(id: string): Promise<User>;
    updateProfile(id: string, dto: UpdateUserDto): Promise<User>;
    updateRole(id: string, role: 'user' | 'support_admin' | 'admin'): Promise<User>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User>;
}
