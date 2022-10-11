FROM node:16-slim AS builder
WORKDIR /app

RUN yarn global add turbo

COPY . .

RUN turbo prune --scope=msgops-tracker --docker

FROM node:16-slim AS installer
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock

RUN yarn install

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN yarn turbo run build --filter=msgops-tracker...

FROM node:16-slim AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs
USER nestjs

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV CLOUD_RUN 1
ENV PORT 3000

ENV HOST 127.0.0.1
ENV TYPEORM_HOST 127.0.0.1
ENV TYPEORM_PORT 5432
ENV TYPEORM_USERNAME postgres
ENV TYPEORM_DATABASE msgops_prd
ENV TYPEORM_CONNECTION postgres
ENV TYPEORM_DRIVER_EXTRA {"charset":"utf8mb4_unicode_ci"}
ENV TYPEORM_ENTITIES_DIR dist/**/entities
ENV TYPEORM_ENTITIES dist/**/*.entity.js
ENV TYPEORM_LOGGING true

ENV REDIS_HOST 127.0.0.1
ENV REDIS_PORT 6379

COPY --from=installer --chown=nestjs:nestjs /app .

CMD node apps/msgops-tracker/dist/main
