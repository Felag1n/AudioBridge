import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return new Response('No code provided', { status: 400 });
  }

  try {
    // Обмен кода на токен
    const tokenResponse = await fetch('https://oauth.yandex.ru/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.YANDEX_CLIENT_ID!,
        client_secret: process.env.YANDEX_CLIENT_SECRET!,
      }),
    });

    const tokenData = await tokenResponse.json();

    // Получение информации о пользователе
    const userResponse = await fetch('https://login.yandex.ru/info', {
      headers: {
        Authorization: `OAuth ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    // Создаем или обновляем пользователя в базе данных
    // TODO: Добавить призму и создание пользователя

    // Устанавливаем куки с токеном
    const cookieStore = cookies();
    cookieStore.set('token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 дней
    });

    // Редирект на главную страницу
    return redirect('/');
  } catch (error) {
    console.error('Auth error:', error);
    return new Response('Authentication failed', { status: 500 });
  }
}