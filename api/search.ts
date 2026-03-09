import { apiGet } from "./client";

// Response shapes

export interface SearchArtist {
	id: string;
	name: string;
	picture: string | null;
}

export interface SearchAlbum {
	id: string;
	title: string;
	cover: string | null;
	releaseDate?: string;
	artist: SearchArtist;
}

export interface SearchTrack {
	id: string;
	title: string;
	duration: number;
	explicit: boolean;
	artist: SearchArtist;
	album: SearchAlbum;
	audioQuality?: string;
}

export interface SearchPlaylist {
	id: string;
	uuid: string;
	title: string;
	numberOfTracks: number;
	squareImage: string | null;
}

export interface SearchPage<T> {
	items: T[];
	limit: number;
	offset: number;
	totalNumberOfItems: number;
}

export interface SearchOptions {
	limit?: number;
	offset?: number;
}

// Helpers

function buildPath(
	param: string,
	query: string,
	{ limit = 10, offset = 0 }: SearchOptions,
): string {
	const qs = new URLSearchParams({
		[param]: query,
		limit: String(limit),
		offset: String(offset),
	});
	return `/search/?${qs}`;
}

// Public API

export function searchTracks(
	query: string,
	opts: SearchOptions = {},
	signal?: AbortSignal,
): Promise<SearchPage<SearchTrack>> {
	return apiGet(buildPath("s", query, opts), signal);
}

export function searchAlbums(
	query: string,
	opts: SearchOptions = {},
	signal?: AbortSignal,
): Promise<SearchPage<SearchAlbum>> {
	return apiGet(buildPath("al", query, opts), signal);
}

export function searchArtists(
	query: string,
	opts: SearchOptions = {},
	signal?: AbortSignal,
): Promise<SearchPage<SearchArtist>> {
	return apiGet(buildPath("a", query, opts), signal);
}

export function searchPlaylists(
	query: string,
	opts: SearchOptions = {},
	signal?: AbortSignal,
): Promise<SearchPage<SearchPlaylist>> {
	return apiGet(buildPath("p", query, opts), signal);
}
