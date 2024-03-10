import { Track } from '../../track/entities/track.entity';
import { Album } from '../../album/entities/album.entity';
import { Artist } from '../../artist/entities/artist.entity';

export class Favorites {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}

export class FavoritesResponse {
  constructor(
    private favorites: Favorites,
    private allArtists: Artist[],
    private allAlbums: Album[],
    private allTracks: Track[],
  ) {}

  getArtists(): Artist[] {
    return this.allArtists.filter((artist) =>
      this.favorites.artists.includes(artist.id),
    );
  }

  getAlbums(): Album[] {
    return this.allAlbums.filter((album) =>
      this.favorites.albums.includes(album.id),
    );
  }

  getTracks(): Track[] {
    return this.allTracks.filter((track) =>
      this.favorites.tracks.includes(track.id),
    );
  }
}
