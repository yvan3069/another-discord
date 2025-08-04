# Stage 1: Install dependencies
FROM node:lts-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN corepack enable npm && npm install --frozen-lockfile

# Stage 2: Build the application
FROM node:lts-alpine AS builder
WORKDIR /app
# 复制所有项目文件，包括源代码、配置文件和 Prisma schema
COPY . .
# 显式生成 Prisma 客户端文件
RUN npx prisma generate
# 新增：运行 TypeScript 编译器，将 .ts 文件编译为 .js 文件
RUN npx tsc
# 运行构建命令
RUN corepack enable npm && npm run build

# Stage 3: Production server
FROM node:lts-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# 复制 package.json 文件，以确保 production 依赖被正确处理
COPY package.json ./
# 从 builder 阶段复制 server.js 和 socket.js
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/socket.js ./socket.js

# 复制 Next.js standalone 模式下所有必需的文件
# 这是解决 'bundle5' 错误的关键
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# 新增：复制 .env 文件，确保运行时环境变量可用
COPY .env ./.env

EXPOSE 3000
# 使用 'npm run start' 命令，它将使用 package.json 中新定义的脚本
CMD ["npm", "run", "start"]