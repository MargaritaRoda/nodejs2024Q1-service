import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Album')
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @ApiOperation({
    summary: 'Add new album',
    description: 'Add new album information',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Album is created',
  })
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    return await this.albumService.create(createAlbumDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get albums list',
    description: 'Gets all library albums list',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful operation' })
  async findAll() {
    return await this.albumService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single album by id',
    description: 'Gets single album by id',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful operation' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const album = await this.albumService.findOne(id);
    if (!album) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: ['Artist is not found by id'],
        error: 'Not found',
      });
    }
    return album;
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update album information',
    description: 'Update library album information by UUID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The album has been updated',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return await this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete album',
    description: 'Delete album from library',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Deleted successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.albumService.remove(id);
  }
  // remove(@Param('id', ParseUUIDPipe) id: string): void {
  //   const album = this.albumService.remove(id);
  //   if (!album) {
  //     throw new NotFoundException({
  //       statusCode: HttpStatus.NOT_FOUND,
  //       message: ['Artist is not found by id'],
  //       error: 'Not found',
  //     });
  //   }
  // }
}
