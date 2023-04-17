import { AllUserDto } from "./all-user.dto";

export class OneUserDto extends AllUserDto {
    secret: string
    createdAt: string
    updatedAt: string
}