FROM node:16-slim AS builder
WORKDIR /app

RUN yarn global add turbo

COPY . .

RUN turbo prune --scope=tracker --docker

FROM node:16-slim AS installer
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock

RUN yarn install

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN yarn turbo run build --filter=tracker...

FROM node:16-slim AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs
USER nestjs

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV CLOUD_RUN 1
ENV PORT 3001

ENV TYPEORM_HOST=host.docker.internal

COPY --from=installer --chown=nestjs:nestjs /app .

CMD ["node", "apps/tracker/dist/main"]
