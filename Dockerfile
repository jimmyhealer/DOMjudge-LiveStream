FROM oven/bun:1-slim AS build-stage

WORKDIR /app
COPY ./package*.json ./
COPY ./bun.lockb ./
RUN bun install

COPY . .
RUN bun run build-only

FROM oven/bun:1-debian AS production-stage

WORKDIR /app
COPY ./server/package*.json ./server/
COPY ./server/bun.lockb ./server/
WORKDIR /app/server
RUN bun install

COPY ./server .
COPY --from=build-stage /app/dist ./public
RUN bun tsc

ENV NODE_ENV production
EXPOSE 3000

CMD ["bun", "run", "dist/index.js"]
