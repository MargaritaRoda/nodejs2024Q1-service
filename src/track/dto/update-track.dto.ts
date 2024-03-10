import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTrackDto {
  @ApiProperty({
    example: 'Updated Song Name',
    description: 'The updated name of the track',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'artistId789',
    description: 'The updated ID of the artist (if available)',
  })
  artistId: string | null;

  @ApiProperty({
    example: 'albumId101112',
    description: 'The updated ID of the album (if available)',
  })
  albumId: string | null;

  @IsNotEmpty()
  @IsNumber()
  duration: number;
}
