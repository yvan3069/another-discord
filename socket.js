/* eslint-disable @typescript-eslint/no-require-imports */
// 这是 socket.ts 编译后的 JavaScript 代码

const { Server: ServerIo } = require("socket.io");
const { Server: NetServer } = require("http");

// 在 TypeScript 文件中的 `declare global` 块在这里被移除，
// 因为它只用于类型检查，不包含运行时代码。

// setupSocketServer 和 getSocketServer 函数保持不变，因为它们是有效的 JavaScript
const setupSocketServer = (httpServer) => {
  if (!global.io) {
    const io = new ServerIo(httpServer, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });
    global.io = io;
  }
  return global.io;
};

const getSocketServer = () => {
  return global.io;
};

// 导出这两个函数
module.exports = {
  setupSocketServer,
  getSocketServer,
};
