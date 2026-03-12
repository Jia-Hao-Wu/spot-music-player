/**
 * TIDAL image URL construction.
 * All cover art and artist photos are served from resources.tidal.com.
 * The UUID from the API uses hyphens; the CDN path uses forward-slashes.
 */

export const ARTWORK_SIZES = {
  thumbnail: 80,
  small: 160,
  medium: 320,
  large: 640,
  xlarge: 1080,
  xxlarge: 1280,
} as const;

export type ArtworkSize = (typeof ARTWORK_SIZES)[keyof typeof ARTWORK_SIZES];

const TIDAL_CDN = 'https://resources.tidal.com/images';

/** Convert a TIDAL UUID to the slash-separated CDN path segment. */
function uuidToPath(uuid: string): string {
  return uuid.replace(/-/g, '/');
}

/**
 * Return a fully-formed TIDAL cover art URL.
 * Falls back to a placeholder if the UUID is absent.
 */
export function artworkUrl(
  uuid: string | null | undefined,
  size: ArtworkSize = ARTWORK_SIZES.medium,
): string {
  if (!uuid) return `https://picsum.photos/seed/cover/${size}`;
  return `${TIDAL_CDN}/${uuidToPath(uuid)}/${size}x${size}.jpg`;
}
