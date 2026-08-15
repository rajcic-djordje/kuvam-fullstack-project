import { SERVER_BASE_URL } from '../../core/constants/api.constants';

export const resolveMediaUrl = (
  mediaUrl: string | null | undefined
): string | null => {
  if (!mediaUrl) {
    return null;
  }

  if (mediaUrl.startsWith('/uploads/')) {
    return `${SERVER_BASE_URL}${mediaUrl}`;
  }

  if (
    mediaUrl.startsWith('http://') ||
    mediaUrl.startsWith('https://')
  ) {
    try {
      const url = new URL(mediaUrl);

      if (url.pathname.startsWith('/uploads/')) {
        return (
          `${SERVER_BASE_URL}` +
          `${url.pathname}` +
          `${url.search}` +
          `${url.hash}`
        );
      }
    } catch {
      return mediaUrl;
    }
  }

  return mediaUrl;
};