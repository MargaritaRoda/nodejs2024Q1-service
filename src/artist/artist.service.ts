import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export const artists: Artist[] = [
  {
    id: '826c1e3f-94f5-4e4e-8c65-452d4a7e7f13', // uuid v4
    name: 'Metallica',
    grammy: true,
  },
  {
    id: '74a280b5-a86a-46bc-8a94-efac780115de', // uuid v4
    name: 'Depeche Mode',
    grammy: true,
  },
  {
    id: '4d9d7923-eecb-4467-b589-2fd6f7a1d198', // uuid v4
    name: 'Moby',
    grammy: true,
  },
];
@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}
  async create(createArtistDto: CreateArtistDto) {
    return this.prisma.artist.create({
      data: {
        id: uuidv4(),
        name: createArtistDto.name,
        grammy: createArtistDto.grammy,
      },
    });
  }

  async findAll(): Promise<Artist[]> {
    return this.prisma.artist.findMany();
  }

  async findOne(id: string): Promise<Artist> {
    return this.prisma.artist.findUnique({ where: { id } });
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    return this.prisma.artist.update({
      where: { id: artist.id },
      data: {
        id: artist.id,
        name: updateArtistDto.name,
        grammy: updateArtistDto.grammy,
        favsId: artist.favsId,
      },
    });
  }
  async remove(id: string) {
    //массив альбомов этого артиста
    const albumsArtistId = await this.prisma.album.findMany({
      where: { artistId: id },
    });
    for (const album of albumsArtistId) {
      await this.prisma.album.update({
        where: { id: album.id },
        data: {
          id: album.id,
          name: album.name,
          year: album.year,
          artistId: null,
          favsId: album.favsId,
        },
      });
    }

    try {
      const deletedArtist = await this.prisma.artist.delete({
        where: {
          id,
        },
      });
      //deletedArtist.favsId = null;
      return deletedArtist;
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
  //   const index = artists.findIndex((item) => {
  //     return item.id === id;
  //   });
  //   if (index === -1) {
  //     return false;
  //   }
  //   for (const album of albums.filter((a) => a.artistId === id)) {
  //     album.artistId = null;
  //   }
  //   for (const track of tracks.filter((t) => t.artistId === id)) {
  //     track.artistId = null;
  //   }
  //   const favArtistIndex = favorites.artists.findIndex((a) => a === id);
  //   if (favArtistIndex !== -1) {
  //     favorites.artists.splice(favArtistIndex, 1);
  //   }
  //   artists.splice(index, 1);
  //   return true;
  // }
}
