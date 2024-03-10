import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// interface UpdatePasswordDto {
//   oldPassword: string; // previous password
//   newPassword: string; // new password
// }
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 'oldPassword123',
    description: 'The old password of the user',
  })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;
  @ApiProperty({
    example: 'newPassword456',
    description: 'The new password for the user',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
