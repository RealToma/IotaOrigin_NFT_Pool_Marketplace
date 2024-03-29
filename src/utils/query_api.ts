import { cookies } from 'next/headers';

export default async function query_api(route: string, data: any = {}) {
  const dev = process.env.NODE_ENV !== 'production';

  const BASE_URL = dev
    ? 'http://localhost:3000/api'
    : process.env.NEXT_PUBLIC_API_URL;

  const url = BASE_URL + (route.startsWith('/') ? '' : '/') + route;
  return await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching ' + url + ': ' + error.toString());
      throw error;
    });
}
