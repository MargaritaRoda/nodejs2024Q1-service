import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export const favorites = {
  artists: ['74a280b5-a86a-46bc-8a94-efac780115de'], // favorite artists ids
  albums: ['65e85587-79cc-4f73-a35d-e5d10691f9cf'], // favorite albums ids
  tracks: ['d9e4d23b-4c56-46ab-a5ad-3b05b6d5b6a5'], // favorite tracks ids
};
@Injectable()
export class FavsService {
  constructor(private prisma: PrismaService) {}

  async createArtist(id: string) {
    const favs = await this.prisma.favorites.findFirst({
      include: { Artist: true },
    });
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      throw new HttpException(
        'Artist doesnt exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    // Check if the artist is already in favorites
    const isArtistInFavorites = await this.prisma.artist.findFirst({
      where: {
        id: artist.id,
        favsId: favs.id,
      },
    });
    if (isArtistInFavorites) {
      throw new HttpException(
        'Artist is already in favorites',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    // Add the artist to favorites
    const updatedFavorites = await this.prisma.favorites.update({
      where: { id: favs.id },
      data: {
        Artist: { connect: { id: artist.id } }, // Connect the artist to favorites
      },
      include: {
        Artist: true, // Include the updated list of artists in the response
      },
    });
    // Format the response
    const result = {
      artists: updatedFavorites.Artist.map((a) => ({
        id: a.id,
        name: a.name,
        grammy: a.grammy,
      })),
    };

    return result.artists.find((a) => a.id === id);
  }

  async createTrack(id: string) {
    const favs = await this.prisma.favorites.findFirst({
      include: { Track: true },
    });
    const track = await this.prisma.track.findUnique({ where: { id } });
    // const track = tracks.find((t) => t.id === id);
    if (!track) {
      throw new HttpException(
        'Track doesnt exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    // Check if the track is already in favorites
    const isTrackInFavorites = await this.prisma.track.findFirst({
      where: {
        id: track.id,
        favsId: favs.id,
      },
    });
    if (isTrackInFavorites) {
      throw new HttpException(
        'Track is already in favorites',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    // Add the track to favorites
    const updatedFavorites = await this.prisma.favorites.update({
      where: { id: favs.id },
      data: {
        Track: { connect: { id: track.id } }, // Connect the track to favorites
      },
      include: {
        Track: true, // Include the updated list of tracks in the response
      },
    });

    const result = {
      tracks: updatedFavorites.Track.map((t) => ({
        id: t.id,
        name: t.name,
        artistId: t.artistId,
        albumId: t.albumId,
        duration: t.duration,
      })),
    };

    return result.tracks.find((t) => t.id === id);
  }
  async createAlbum(id: string) {
    const favs = await this.prisma.favorites.findFirst({
      include: { Album: true },
    });
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) {
      throw new HttpException(
        'Album doesnt exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    // Check if the album is already in favorites
    const isAlbumInFavorites = await this.prisma.album.findFirst({
      where: {
        id: album.id,
        favsId: favs.id,
      },
    });
    if (isAlbumInFavorites) {
      throw new HttpException(
        'Album is already in favorites',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    // Add the album to favorites
    await this.prisma.favorites.update({
      where: { id: favs.id },
      data: {
        Album: { connect: { id: album.id } }, // Connect the track to favorites
      },
      include: {
        Album: true, // Include the updated list of tracks in the response
      },
    });
    //
    // const result = {
    //   albums: updatedFavorites.Album.map((a) => ({
    //     id: a.id,
    //     name: a.name,
    //     year: a.year,
    //     artistId: a.artistId,
    //   })),
    // };
    // const favsAlbum = result.albums.find((a) => a.id === id);
    // return favsAlbum.id;
    return album.id;
  }

  async findAll() {
    const favs = await this.prisma.favorites.findFirst({
      // relationLoadStrategy: 'join', // or 'query'
      include: {
        Artist: true,
        Album: true,
        Track: true,
      },
    });
    console.log(favs);
    const result = {
      artists: favs.Artist.map((a) => ({
        id: a.id,
        name: a.name,
        grammy: a.grammy,
      })),
      albums: favs.Album.map((a) => ({
        id: a.id,
        name: a.name,
        year: a.year,
        artistId: a.artistId,
      })),
      tracks: favs.Track.map((t) => ({
        id: t.id,
        name: t.name,
        artistId: t.artistId,
        albumId: t.albumId,
        duration: t.duration,
      })),
    };
    console.log(result);
    return result;

    // const favoritesResponse = new FavoritesResponse(
    //   favorites,
    //   artists,
    //   albums,
    //   tracks,
    // ); // Pass all arrays and Favorites instance
    // const favoriteArtists = favoritesResponse.getArtists();
    // const favoriteAlbums = favoritesResponse.getAlbums();
    // const favoriteTracks = favoritesResponse.getTracks();
    // return {
    //   artists: favoriteArtists,
    //   albums: favoriteAlbums,
    //   tracks: favoriteTracks,
    // }; //`This action returns all favs`;
  }

  async removeArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    const favorites = await this.prisma.favorites.findFirst({
      include: { Artist: true },
    });

    if (!favorites) {
      throw new HttpException('Favorites not found', HttpStatus.NOT_FOUND);
    }
    // Check if the artist is in favorites
    const artistIndex = favorites.Artist.findIndex((a) => a.id === id);

    if (artistIndex === -1) {
      throw new HttpException(
        'Artist is not in favorites',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    // Remove the artist from favorites
    await this.prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        Artist: { disconnect: { id } }, // Disconnect the artist from favorites
      },
      include: {
        Artist: true, // Include the updated list of artists in the response
      },
    });
    return {
      id: artist.id,
      name: artist.name,
      grammy: artist.grammy,
    };
  }
  //   const index = favorites.artists.findIndex((a) => a === id);
  //   if (index === -1) {
  //     throw new HttpException('Artists doesnt exist', HttpStatus.NOT_FOUND);
  //   }
  //   favorites.artists.splice(index, 1);
  //   return true; // `This action removes a #${id} fav`;
  // }
  async removeTrack(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    const favorites = await this.prisma.favorites.findFirst({
      include: { Track: true },
    });

    if (!favorites) {
      throw new HttpException('Favorites not found', HttpStatus.NOT_FOUND);
    }
    // Check if the track is in favorites
    const trackIndex = favorites.Track.findIndex((t) => t.id === id);

    if (trackIndex === -1) {
      throw new HttpException(
        'Track is not in favorites',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    // Remove the track from favorites
    await this.prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        Track: { disconnect: { id } }, // Disconnect the track from favorites
      },
      include: {
        Track: true, // Include the updated list of tracks in the response
      },
    });
    return {
      id: track.id,
      name: track.name,
      artistId: track.artistId,
      albumId: track.albumId,
      duration: track.duration,
    };
    // const index = favorites.tracks.findIndex((t) => t === id);
    // if (index === -1) {
    //   throw new HttpException('Track doesnt exist', HttpStatus.NOT_FOUND);
    // }
    // favorites.tracks.splice(index, 1);
    // return true; // `This action removes a #${id} fav`;
  }
  async removeAlbum(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    const favorites = await this.prisma.favorites.findFirst({
      include: { Album: true },
    });

    if (!favorites) {
      throw new HttpException('Favorites not found', HttpStatus.NOT_FOUND);
    }
    // Check if the album is in favorites
    const albumIndex = favorites.Album.findIndex((t) => t.id === id);

    if (albumIndex === -1) {
      throw new HttpException(
        'Album is not in favorites',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    // Remove the album from favorites
    await this.prisma.favorites.update({
      where: { id: favorites.id },
      data: {
        Album: { disconnect: { id } }, // Disconnect the album from favorites
      },
      include: {
        Album: true, // Include the updated list of albums in the response
      },
    });
    return {
      id: album.id,
      name: album.name,
      artistId: album.artistId,
      year: album.year,
    };
    // const index = favorites.albums.findIndex((a) => a === id);
    // if (index === -1) {
    //   throw new HttpException('Track doesnt exist', HttpStatus.NOT_FOUND);
    // }
    // favorites.albums.splice(index, 1);
    // return true; // `This action removes a #${id} fav`;
  }
}
