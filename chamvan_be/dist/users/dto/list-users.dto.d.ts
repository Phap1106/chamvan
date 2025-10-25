import { Role } from '../../common/role.enum';
export declare class ListUsersQueryDto {
    q?: string;
    role?: Role;
    page?: number;
    limit?: number;
}
