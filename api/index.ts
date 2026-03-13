/**
 * Public API surface for the Monochrome integration layer.
 *
 * Import from `@/api` — never from individual sub-modules outside this folder.
 * Internal helpers (pickInstance, markFailed, apiGet, …) are not re-exported.
 */

// Images
export { ARTWORK_SIZES, artworkUrl } from "./images";
export type { ArtworkSize } from "./images";

// Search
export { searchAlbums, searchArtists, searchPlaylists, searchTracks } from "./search";
export type {
	SearchAlbum,
	SearchOptions,
	SearchPage,
	SearchPlaylist,
} from "./search";

// Stream resolution
export { getTrackStream, resolveStreamUrl } from "./track";
export type { StreamQuality } from "./track";

// Full-detail metadata
export {
	getAlbumDetail,
	getArtistDetail,
	getPlaylistDetail,
	getRecommendations,
	getSimilarArtists,
	getTrackMeta,
} from "./metadata";
export type {
	AlbumDetail,
	AlbumMeta,
	ArtistDetail,
	ArtistMeta,
	PlaylistDetail,
	Recommendation,
	TrackMeta,
} from "./metadata";

// Error type
export { ApiError } from "./client";
