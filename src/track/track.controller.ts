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
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Track')
@Controller('track')
export class TrackController {
  private updateTrackDto: UpdateTrackDto;
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @ApiOperation({
    summary: 'Add new track',
    description: 'Add new track information',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful operation',
  })
  create(@Body() createTrackDto: CreateTrackDto) {
    const track = this.trackService.create(createTrackDto);
    return track;
  }

  @Get()
  @ApiOperation({
    summary: 'Get tracks list',
    description: 'Gets all library tracks list',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful operation' })
  findAll(): Track[] {
    return this.trackService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single track by id',
    description: 'Gets single track by id',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful operation' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const track = await this.trackService.findOne(id);
    if (!track) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: ['Track is not found by id'],
        error: 'Not found',
      });
    }
    return track;
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update track information',
    description: 'Update library track information by UUID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The track has been updated',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete track',
    description: 'Delete track from library',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Deleted successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const track = await this.trackService.remove(id);
    if (!track) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: ['Track is not found by id'],
        error: 'Not found',
      });
    }
  }
}
