export class CreateUserDto {
    firstname: string;
    lastname: string;
    phone: string;
    email: string;
    company_name: string;
    roles: string[]
    refreshToken: string
    secret: string
    key: string;
    blocked: boolean;
    username: string;
    password: string;
}
