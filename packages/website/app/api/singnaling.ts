import { NextApiRequest } from 'next';
import { Server } from 'ws';

let wss: Server | null = null;
const clients = new Map<string, Set<any>>();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: any) {
  if (!res.socket.server.ws) {
    const WebSocketServer = require('ws').Server;
    wss = new WebSocketServer({ server: res.socket.server });

    wss.on('connection', function connection(ws: any) {
      let roomId = '';

      ws.on('message', function incoming(message: string) {
        const data = JSON.parse(message);
        if (data.type === 'join') {
          roomId = data.roomId;
          if (!clients.has(roomId)) clients.set(roomId, new Set());
          clients.get(roomId)?.add(ws);
        } else {
          // 广播消息给房间内其他用户
          clients.get(roomId)?.forEach(client => {
            if (client !== ws) {
              client.send(JSON.stringify(data));
            }
          });
        }
      });

      ws.on('close', () => {
        clients.get(roomId)?.delete(ws);
      });
    });

    res.socket.server.ws = wss;
  }
  res.end();
}