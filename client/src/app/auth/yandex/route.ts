//client\src\app\auth\yandex\route.ts

import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const clientId = process.env.YANDEX_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/yandex/callback';
  
  const authUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
  
  return redirect(authUrl);
}
