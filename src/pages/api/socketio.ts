import { SocketHandler } from '@/lib/socket'

export default function handler(req: any, res: any) {
  return SocketHandler(req, res)
}
