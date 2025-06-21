import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIo } from "socket.io";
import { NextApiResponseServerIo } from "@/type";

// TODO: 在nextjs使用websocket方法 page router, custom server
// TODO: 登录界面时一直请求 /api/socket/io原因

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIo(httpServer, {
      path: path,
      addTrailingSlash: false,
    });

    res.socket.server.io = io;

    //res.end();
  }
};

export default ioHandler;
