import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export const albums: Album[] = [
  {
    id: 'b124f0d9-5736-4b1d-bc3e-87881f1870b1', // uuid v4
    name: 'Black album',
    year: 1991,
    artistId: '826c1e3f-94f5-4e4e-8c65-452d4a7e7f13',
  },
  {
    id: '65e85587-79cc-4f73-a35d-e5d10691f9cf', // uuid v4
    name: 'Songs of Faith and Devotion',
    year: 1993,
    artistId: '74a280b5-a86a-46bc-8a94-efac780115de',
  },
  {
    id: 'c1e32836-7fb7-4906-86e4-eb1b3eb2c3ff', // uuid v4
    name: 'Hotel',
    year: 2005,
    artistId: '4d9d7923-eecb-4467-b589-2fd6f7a1d198',
  },
];
@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}
  async create(createAlbumDto: CreateAlbumDto) {
    return this.prisma.album.create({
      data: {
        id: uuidv4(), // uuid v4
        name: createAlbumDto.name,
        year: createAlbumDto.year,
        artistId: createAlbumDto.artistId,
      },
    }); // 'This action adds a new album';
  }

  async findAll(): Promise<Album[]> {
    return this.prisma.album.findMany();
  }

  async findOne(id: string): Promise<Album> | null {
    return this.prisma.album.findUnique({ where: { id } });
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }
    return this.prisma.album.update({
      where: { id: album.id },
      data: {
        name: updateAlbumDto.name,
        year: updateAlbumDto.year,
        artistId: updateAlbumDto.artistId,
      },
    });
  }

  async remove(id: string) {
    try {
      const deletedAlbum = await this.prisma.album.delete({
        where: {
          id,
        },
      });
      //deletedAlbum.favsId = null;
      return deletedAlbum;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
      } else console.error(error);
    }
  }

  // remove(id: string): boolean {
  //   const index = albums.findIndex((item) => {
  //     return item.id === id;
  //   });
  //   if (index === -1) {
  //     return false;
  //   }
  //   for (const track of tracks.filter((t) => t.albumId === id)) {
  //     track.albumId = null;
  //   }
  //   const favAlbumIndex = favorites.albums.findIndex((a) => a === id);
  //   if (favAlbumIndex !== -1) {
  //     favorites.artists.splice(favAlbumIndex, 1);
  //   }
  //   albums.splice(index, 1);
  //   return true; // `This action removes a #${id} album`;
  // }
}
