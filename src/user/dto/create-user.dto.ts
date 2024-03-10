import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'The login of the user' })
  @IsString()
  @IsNotEmpty()
  login: string;
  @ApiProperty({
    example: 'password123',
    description: 'The password for the user',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
// interface CreateUserDto {
//   login: string;
//   password: string;
// }
// export class ResponseUserDto extends PartialType(CreateUserDto) {
//   @IsString()
//   login: string;
// }
