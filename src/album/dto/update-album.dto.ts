import { PartialType } from '@nestjs/mapped-types';
import { CreateAlbumDto } from './create-album.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsStringOrNull(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'isStringOrNull',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' || value === null;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a string or null`;
        },
      },
    });
  };
}
export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {
  @ApiProperty({
    example: 'Updated Album Name',
    description: 'The updated name of the album',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 2023,
    description: 'The updated release year of the album',
  })
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @ApiProperty({
    example: 'artistId456',
    description: 'The updated ID of the artist (if available)',
  })
  @IsStringOrNull()
  artistId: string | null; // refers to Artist
}
