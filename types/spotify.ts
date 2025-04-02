export type SpotifyResponse =
  | {
      isListening: true;
      href: string;
      name: string;
      thumbnailUrl: string;
      artists: {
        name: string;
        href: string;
      }[];
    }
  | {
      isListening: false;
      name: null;
    };
