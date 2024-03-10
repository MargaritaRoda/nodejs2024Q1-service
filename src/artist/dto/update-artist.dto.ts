import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistDto } from './create-artist.dto';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateArtistDto extends PartialType(CreateArtistDto) {
  @ApiProperty({
    example: 'Updated Artist Name',
    description: 'The updated name of the artist',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: false,
    description: 'Whether the artist has won a Grammy award',
  })
  @IsNotEmpty()
  @IsBoolean()
  grammy: boolean;
}
