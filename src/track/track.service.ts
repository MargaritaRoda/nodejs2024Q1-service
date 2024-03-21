import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export const tracks: Track[] = [
  {
    id: uuidv4(),
    name: 'Nothing Else Matters',
    artistId: '826c1e3f-94f5-4e4e-8c65-452d4a7e7f13', // | null
    albumId: 'b124f0d9-5736-4b1d-bc3e-87881f1870b1', //| null
    duration: 6,
  },
  {
    id: '41e1d928-790d-4e16-bc0c-d065f0a33f3f',
    name: 'Enter Sandmen',
    artistId: '826c1e3f-94f5-4e4e-8c65-452d4a7e7f13', // | null
    albumId: 'b124f0d9-5736-4b1d-bc3e-87881f1870b1', //| null
    duration: 5,
  },
  {
    id: '5d15e1fc-ff31-4ad5-8897-bd5c5217b7d8',
    name: 'I feel You',
    artistId: '74a280b5-a86a-46bc-8a94-efac780115de', // | null
    albumId: '65e85587-79cc-4f73-a35d-e5d10691f9cf', //| null
    duration: 4,
  },
  {
    id: 'd9e4d23b-4c56-46ab-a5ad-3b05b6d5b6a5',
    name: 'Higher Love',
    artistId: '74a280b5-a86a-46bc-8a94-efac780115de', // | null
    albumId: '65e85587-79cc-4f73-a35d-e5d10691f9cf', //| null
    duration: 5,
  },
  {
    id: 'e44e9d28-0b7b-4a09-9be2-16a68b4aa99c',
    name: 'Left me up',
    artistId: uuidv4(), // | null
    albumId: 'c1e32836-7fb7-4906-86e4-eb1b3eb2c3ff', //| null
    duration: 3,
  },
  {
    id: uuidv4(),
    name: 'Beautiful"',
    artistId: '4d9d7923-eecb-4467-b589-2fd6f7a1d198', // | null
    albumId: 'c1e32836-7fb7-4906-86e4-eb1b3eb2c3ff', //| null
    duration: 3,
  },
];

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}
  async create(createTrackDto: CreateTrackDto) {
    return this.prisma.track.create({
      data: {
        id: uuidv4(),
        name: createTrackDto.name,
        artistId: createTrackDto.artistId,
        albumId: createTrackDto.albumId,
        duration: createTrackDto.duration,
      },
    });
    // const newTrack = {
    //   name: createTrackDto.name,
    //   artistId: createTrackDto.artistId,
    //   albumId: createTrackDto.albumId,
    //   duration: createTrackDto.duration,
    //   id: uuidv4(),
    // };
    // tracks.push(newTrack);
    // return newTrack; // 'This action adds a new track';
  }

  async findAll() {
    return this.prisma.track.findMany();
  }

  async findOne(id: string): Promise<Track | null> {
    return this.prisma.track.findUnique({ where: { id } });
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    return this.prisma.track.update({
      where: { id: track.id },
      data: {
        id: track.id,
        name: updateTrackDto.name,
        albumId: updateTrackDto.albumId,
        artistId: updateTrackDto.artistId,
        duration: updateTrackDto.duration,
      },
    });
  }

  async remove(id: string) {
    try {
      const deletedTrack = await this.prisma.track.delete({
        where: {
          id,
        },
      });
      //deletedArtist.favsId = null;
      return deletedTrack;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
      } else console.error(error);
    }
  }
  // async remove(id: string): Promise<boolean> {
  //   const index = tracks.findIndex((item) => {
  //     return item.id === id;
  //   });
  //   if (index === -1) {
  //     return false;
  //   }
  //   const favTrackIndex = favorites.tracks.findIndex((a) => a === id);
  //   if (favTrackIndex !== -1) {
  //     favorites.artists.splice(favTrackIndex, 1);
  //   }
  //   tracks.splice(index, 1);
  //   return true;
  // }
}
