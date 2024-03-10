import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FavoritesResponse } from './entities/fav.entity';
import { tracks } from '../track/track.service';
import { albums } from '../album/album.service';
import { artists } from '../artist/artist.service';
import { Artist } from '../artist/entities/artist.entity';
import { Track } from '../track/entities/track.entity';
import { Album } from '../album/entities/album.entity';

export const favorites = {
  artists: ['74a280b5-a86a-46bc-8a94-efac780115de'], // favorite artists ids
  albums: ['65e85587-79cc-4f73-a35d-e5d10691f9cf'], // favorite albums ids
  tracks: ['d9e4d23b-4c56-46ab-a5ad-3b05b6d5b6a5'], // favorite tracks ids
};
@Injectable()
export class FavsService {
  createArtist(id: string): Artist {
    const artist = artists.find((a) => a.id === id);
    if (!artist) {
      throw new HttpException(
        'Artist doesnt exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    favorites.artists.push(artist.id);
    return artist;
  }
  createTrack(id: string): Track {
    const track = tracks.find((t) => t.id === id);
    if (!track) {
      throw new HttpException(
        'Track doesnt exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    favorites.tracks.push(track.id);
    return track;
  }
  createAlbum(id: string): Album['id'] {
    const album = albums.find((a) => a.id === id);
    if (!album) {
      throw new HttpException(
        'Album doesnt exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (favorites.albums.indexOf(album.id) === -1) {
      favorites.albums.push(album.id);
    }
    return album.id;
  }

  findAll() {
    const favoritesResponse = new FavoritesResponse(
      favorites,
      artists,
      albums,
      tracks,
    ); // Pass all arrays and Favorites instance
    const favoriteArtists = favoritesResponse.getArtists();
    const favoriteAlbums = favoritesResponse.getAlbums();
    const favoriteTracks = favoritesResponse.getTracks();
    return {
      artists: favoriteArtists,
      albums: favoriteAlbums,
      tracks: favoriteTracks,
    }; //`This action returns all favs`;
  }

  removeArtist(id: string): boolean {
    const index = favorites.artists.findIndex((a) => a === id);
    if (index === -1) {
      throw new HttpException('Artists doesnt exist', HttpStatus.NOT_FOUND);
    }
    favorites.artists.splice(index, 1);
    return true; // `This action removes a #${id} fav`;
  }
  removeTrack(id: string): boolean {
    const index = favorites.tracks.findIndex((t) => t === id);
    if (index === -1) {
      throw new HttpException('Track doesnt exist', HttpStatus.NOT_FOUND);
    }
    favorites.tracks.splice(index, 1);
    return true; // `This action removes a #${id} fav`;
  }
  removeAlbum(id: string): boolean {
    const index = favorites.albums.findIndex((a) => a === id);
    if (index === -1) {
      throw new HttpException('Track doesnt exist', HttpStatus.NOT_FOUND);
    }
    favorites.albums.splice(index, 1);
    return true; // `This action removes a #${id} fav`;
  }
}
