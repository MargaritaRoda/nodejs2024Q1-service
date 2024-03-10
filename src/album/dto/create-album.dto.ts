import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlbumDto {
  @ApiProperty({ example: 'Album Name', description: 'The name of the album' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 2022, description: 'The release year of the album' })
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @ApiProperty({
    example: 'artistId123',
    description: 'The ID of the artist (if available)',
  })
  artistId: string | null; // refers to Artist
}
