import {
  SERVER_BASE_URL
} from '../../core/constants/api.constants';

export const resolveMediaUrl = (
  imageUrl: string | null | undefined
): string => {
  if (!imageUrl) {
    return '';
  }

  if (
    imageUrl.startsWith(
      '/uploads/'
    )
  ) {
    return (
      `${SERVER_BASE_URL}${imageUrl}`
    );
  }

  if (
    imageUrl.startsWith(
      'http://'
    ) ||
    imageUrl.startsWith(
      'https://'
    )
  ) {
    try {
      const url =
        new URL(imageUrl);

      if (
        url.pathname.startsWith(
          '/uploads/'
        )
      ) {
        return (
          `${SERVER_BASE_URL}${url.pathname}`
        );
      }
    } catch {
      return imageUrl;
    }
  }

  return imageUrl;
};