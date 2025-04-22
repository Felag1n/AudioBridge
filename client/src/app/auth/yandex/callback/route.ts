//client\src\app\auth\yandex\callback\route.ts
import { NextResponse } from 'next/server';

const REDIRECT_URI = 'http://localhost:3001/auth/yandex/callback';
const API_BASE_URL = 'http://localhost:8000/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return new NextResponse('No code provided', { status: 400 });
    }

    console.log('Получен код авторизации, обмениваем на токен...');

    const response = await fetch(`${API_BASE_URL}/auth/yandex/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        redirect_uri: REDIRECT_URI
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error from backend:', errorText);
      // Перенаправляем на страницу логина с сообщением об ошибке
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(errorText)}`, request.url)
      );
    }

    const data = await response.json();
  // Добавьте в начало route.ts
console.log('Запрос к роуту /auth/yandex/callback с параметрами:', 
  Object.fromEntries(new URL(request.url).searchParams.entries()));

    // Вместо использования cookies, добавляем данные в hash часть URL
    // Hash часть не передается на сервер, поэтому не будет вызывать повторных запросов
    const successUrl = new URL('/auth/yandex/success', request.url);
    
    // Кодируем данные и добавляем их в hash часть URL
    const hashData = [
      `token=${encodeURIComponent(data.token)}`,
      `userData=${encodeURIComponent(JSON.stringify({
        id: data.user.id,
        username: data.user.username, 
        email: data.user.email,
        avatarUrl: data.user.avatarUrl || null
      }))}`
    ].join('&');
    
    successUrl.hash = hashData;
    
    console.log('Перенаправление на страницу успеха с данными в URL hash');
    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error('Auth error:', error);
    // В случае ошибки перенаправляем на страницу логина
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent('Authentication failed')}`, request.url)
    );
  }
}