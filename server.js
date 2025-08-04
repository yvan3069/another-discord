/* eslint-disable @typescript-eslint/no-require-imports */
const { createServer } = require("http");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

// 导入 setupSocketServer 函数
const { setupSocketServer } = require("./socket");

nextApp.prepare().then(() => {
  const server = createServer(nextHandler);

  // 使用新的函数来创建和保存 socket.io 实例
  setupSocketServer(server);

  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Next.js & WebSocket server ready on port ${port}`);
  });
});
