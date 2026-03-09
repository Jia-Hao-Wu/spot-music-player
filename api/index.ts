/**
 * Public API surface for the Monochrome integration layer.
 *
 * Import from `@/api` — never from individual sub-modules outside this folder.
 * Internal helpers (pickInstance, markFailed, apiGet, …) are not re-exported.
 */

// Images
export { artworkUrl, ARTWORK_SIZES } from './images';
export type { ArtworkSize } from './images';

// Search
export {
  searchTracks,
  searchAlbums,
  searchArtists,
  searchPlaylists,
} from './search';
export type {
  SearchTrack,
  SearchAlbum,
  SearchArtist,
  SearchPlaylist,
  SearchPage,
  SearchOptions,
} from './search';

// Stream resolution
export { getTrackStream, resolveStreamUrl } from './track';
export type { StreamQuality } from './track';

// Full-detail metadata
export {
  getTrackInfo,
  getAlbumDetail,
  getArtistDetail,
  getRecommendations,
} from './metadata';
export type {
  TrackInfo,
  AlbumDetail,
  ArtistDetail,
  ArtistMeta,
  AlbumMeta,
  Recommendation,
} from './metadata';

// Error type
export { ApiError } from './client';
