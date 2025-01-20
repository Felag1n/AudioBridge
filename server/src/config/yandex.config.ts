export const yandexConfig = {
    api: {
      baseUrl: 'https://api.music.yandex.net',
      endpoints: {
        search: '/search',
        track: '/tracks',
        artist: '/artists',
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    },
    auth: {
      clientId: process.env.YANDEX_CLIENT_ID,
      clientSecret: process.env.YANDEX_CLIENT_SECRET,
      callbackUrl: process.env.YANDEX_CALLBACK_URL,
    },
  };