import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArtistDto {
  @ApiProperty({
    example: 'Artist Name',
    description: 'The name of the artist',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: true,
    description: 'Whether the artist has won a Grammy award',
  })
  @IsNotEmpty()
  @IsBoolean()
  grammy: boolean;
}
