import {
  BadRequestException,
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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { UserExistsError } from '../user/user.service';
import { Artist } from './entities/artist.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Artist')
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @ApiOperation({
    summary: 'Add new artist',
    description: 'Add new artist',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful operation',
  })
  async create(@Body() createArtistDto: CreateArtistDto) {
    try {
      const artist = await this.artistService.create(createArtistDto);
      return {
        id: artist.id,
        name: artist.name,
        grammy: artist.grammy,
        favsId: null,
      };
    } catch (err) {
      if (err instanceof UserExistsError) {
        throw new BadRequestException({
          statusCode: 400,
          message: [err.message],
          error: 'Bad Request',
        });
      }
      throw err;
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get all artists',
    description: 'Gets all artists',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful operation' })
  async findAll(): Promise<Artist[]> {
    return await this.artistService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single artist by id',
    description: 'Get single artist by id',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful operation' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const artist = await this.artistService.findOne(id);
    if (!artist) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: ['Artist is not found by id'],
        error: 'Not found',
      });
    }
    return artist;
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update artist information',
    description: 'Update artist information by UUID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The artist has been updated',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    return await this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete artist',
    description: 'Delete artist from library',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Deleted successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.artistService.remove(id);
  }
}
