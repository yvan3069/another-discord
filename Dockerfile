# Stage 1: Install dependencies
FROM node:lts-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN corepack enable npm && npm install --frozen-lockfile

# Stage 2: Build the application
FROM node:lts-alpine AS builder
WORKDIR /app
# 复制依赖
COPY --from=deps /app/node_modules ./node_modules
# 复制所有项目文件
COPY . .
# 显式生成 Prisma 客户端文件，这一步非常关键！
RUN npx prisma generate
# 运行构建命令
RUN corepack enable npm && npm run build

# Stage 3: Production server
FROM node:lts-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
# 复制构建好的文件
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# 复制 package.json 文件，以确保 production 依赖被正确处理
COPY package.json ./

EXPOSE 3000
CMD ["node", "server.js"]
