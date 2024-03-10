import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4 as uuidv4 } from 'uuid';
import { tracks } from '../track/track.service';
import { albums } from '../album/album.service';
import { favorites } from '../favs/favs.service';

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
  create(createArtistDto: CreateArtistDto) {
    const newArtist = {
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
      id: uuidv4(),
    };
    artists.push(newArtist);
    return newArtist; //'This action adds a new artist';
  }

  async findAll(): Promise<Artist[]> {
    return artists; //`This action returns all artist`;
  }

  findOne(id: string): Artist | null {
    return (
      artists.find((item) => {
        return item.id === id;
      }) || null
    );
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    const artist = artists.find((item) => {
      return item.id === id;
    });
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;
    return artist;
  }

  remove(id: string): boolean {
    const index = artists.findIndex((item) => {
      return item.id === id;
    });
    if (index === -1) {
      return false;
    }
    for (const album of albums.filter((a) => a.artistId === id)) {
      album.artistId = null;
    }
    for (const track of tracks.filter((t) => t.artistId === id)) {
      track.artistId = null;
    }
    const favArtistIndex = favorites.artists.findIndex((a) => a === id);
    if (favArtistIndex !== -1) {
      favorites.artists.splice(favArtistIndex, 1);
    }
    artists.splice(index, 1);
    return true;
  }
}
