/**
 * Full-detail metadata endpoints.
 * Returns richer objects than search — used for album/artist screens
 * and for enriching queue items with duration, track number, etc.
 */

import { apiGet } from "./client";

// Types

export interface ArtistMeta {
	id: string;
	name: string;
	picture: string | null;
	type?: string;
}

export interface AlbumMeta {
	id: string;
	title: string;
	cover: string | null;
	releaseDate?: string;
	numberOfTracks?: number;
	explicit?: boolean;
	artist: ArtistMeta;
	artists?: ArtistMeta[];
}

export interface TrackInfo {
	id: string;
	title: string;
	version?: string | null;
	duration: number;
	explicit: boolean;
	trackNumber?: number;
	volumeNumber?: number;
	popularity?: number;
	audioQuality?: string;
	isUnavailable?: boolean;
	previewUrl?: string | null;
	artist: ArtistMeta;
	artists?: ArtistMeta[];
	album: AlbumMeta;
}

export interface AlbumDetail {
	album: AlbumMeta;
	items: { item: TrackInfo }[];
}

export interface ArtistDetail extends ArtistMeta {
	biography?: string;
	albums?: AlbumMeta[];
	eps?: AlbumMeta[];
	tracks?: TrackInfo[];
}

export interface Recommendation {
	id: string;
	title: string;
	duration: number;
	artist: ArtistMeta;
	album: AlbumMeta;
}

// Public API

export function getTrackInfo(id: string, signal?: AbortSignal): Promise<TrackInfo> {
	return apiGet(`/info/?${new URLSearchParams({ id })}`, signal);
}

export function getAlbumDetail(
	id: string,
	opts: { offset?: number; limit?: number } = {},
	signal?: AbortSignal,
): Promise<AlbumDetail> {
	const params: Record<string, string> = { id };
	if (opts.offset !== undefined) params.offset = String(opts.offset);
	if (opts.limit !== undefined) params.limit = String(opts.limit);
	return apiGet(`/album/?${new URLSearchParams(params)}`, signal);
}

export function getArtistDetail(id: string, signal?: AbortSignal): Promise<ArtistDetail> {
	return apiGet(`/artist/?${new URLSearchParams({ id })}`, signal);
}

export function getRecommendations(
	id: string,
	signal?: AbortSignal,
): Promise<{ items: Recommendation[] }> {
	return apiGet(`/recommendations/?${new URLSearchParams({ id })}`, signal);
}
