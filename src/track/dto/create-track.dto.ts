import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackDto {
  @ApiProperty({ example: 'Song Name', description: 'The name of the track' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'artistId123',
    description: 'The ID of the artist (if available)',
  })
  artistId: string | null;

  @ApiProperty({
    example: 'albumId456',
    description: 'The ID of the album (if available)',
  })
  albumId: string | null;

  @ApiProperty({
    example: 180,
    description: 'The duration of the track in seconds',
  })
  @IsNotEmpty()
  @IsNumber()
  duration: number;
}
