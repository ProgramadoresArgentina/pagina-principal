import { NextRequest } from 'next/server';

export function validateAdminApiKey(request: NextRequest): boolean {
  const adminApiKey = request.headers.get('Authorization')?.split(' ')[1];
  return adminApiKey === process.env.ADMIN_API_KEY;
}
