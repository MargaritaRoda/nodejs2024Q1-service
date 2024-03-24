import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FavsService } from './favs.service';
import { Artist } from '../artist/entities/artist.entity';
import { Track } from '../track/entities/track.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Favorites')
@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}
  @Get()
  @ApiOperation({
    summary: 'Get all favorites',
    description: 'Gets all favorites artists, tracks and albums',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful operation' })
  async findAll() {
    return await this.favsService.findAll();
  }

  @Post(':entityType/:id')
  @ApiOperation({
    summary: 'Added new artist, track or album to favorites',
    description: 'Added new artist, track or album to favorites by UUID',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful operation',
  })
  async createEntity(
    @Param('entityType') entityType: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Artist | Track | string> {
    switch (entityType) {
      case 'artist':
        return await this.favsService.createArtist(id);
      case 'track':
        return await this.favsService.createTrack(id);
      case 'album':
        return await this.favsService.createAlbum(id);
    }
  }

  @Delete(':entityType/:id') // Example: /favs/album/123
  @ApiOperation({
    summary: 'Delete new artist, track or album to favorites',
    description: 'Delete new artist, track or album to favorites by UUID',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Successful operation',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeEntity(
    @Param('entityType') entityType: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    switch (entityType) {
      case 'artist':
        return await this.favsService.removeArtist(id);
      case 'track':
        return await this.favsService.removeTrack(id);
      case 'album':
        return this.favsService.removeAlbum(id);
      default:
        throw new NotFoundException('Invalid entity type');
    }
  }
}
