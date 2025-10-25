import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ListUsersQueryDto } from './dto/list-users.dto';
import { Role } from '../common/role.enum';
export declare class UsersController {
    private readonly users;
    constructor(users: UsersService);
    register(dto: CreateUserDto): Promise<import("./user.entity").User>;
    adminCreate(dto: CreateUserDto & {
        role?: Role;
    }): Promise<import("./user.entity").User>;
    me(req: any): any;
    list(q: ListUsersQueryDto): Promise<{
        items: import("./user.entity").User[];
        total: number;
        page: number;
        limit: number;
    }>;
    getOne(id: string): Promise<import("./user.entity").User>;
    update(id: string, dto: UpdateUserDto): Promise<import("./user.entity").User>;
    updateRole(id: string, dto: UpdateRoleDto): Promise<import("./user.entity").User>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
