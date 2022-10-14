# Create a base section that later steps will use
FROM node:16-slim AS base

ENV YARN_VERSION 1.22.19
RUN yarn policies set-version $YARN_VERSION

# RUN apk add git
# RUN apk update

WORKDIR /app

# Create a layer for pruning the monorepo
FROM base AS pruner
WORKDIR /app

RUN yarn global add turbo

# Copy the entire monorepo to the container
# An alternative would be copying only the desired app, and depended upon packages from the get go and not running turbo prune.
# This would be faster, but is less modular and requires editing the Dockerfile for each app.
# Simply personal preference here.
COPY . .
RUN turbo prune --scope=msgops-tracker --docker

# Create a layer for installing modules
FROM base AS installer
WORKDIR /app

# Add lockfile and package.json's of isolated subworkspace
COPY .gitignore .gitignore
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock

# Use pure lockfile for faster install
RUN yarn install --pure-lockfile

# Build the project
# Copy pruned monorepo
COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json
RUN yarn turbo run build --filter=msgops-tracker... --include-dependencies --no-deps

# Combine the layers into a fucntioning app.
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nestjs
RUN adduser --system --uid 1001 nestjs
USER nestjs

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV CLOUD_RUN 1
ENV PORT 3000

ENV HOST 127.0.0.1
ENV TYPEORM_HOST host.docker.internal
ENV TYPEORM_PORT 5432
ENV TYPEORM_USERNAME postgres
ENV TYPEORM_PASSWORD=
ENV TYPEORM_DATABASE msgops_prd
ENV TYPEORM_CONNECTION postgres
ENV TYPEORM_DRIVER_EXTRA='{"charset":"utf8mb4_unicode_ci"}'
ENV TYPEORM_ENTITIES_DIR='dist/**/entities'
ENV TYPEORM_ENTITIES='dist/**/*.entity.js'
ENV TYPEORM_LOGGING true

ENV REDIS_HOST host.docker.internal
ENV REDIS_PORT 6379

COPY --from=installer --chown=nestjs:nestjs /app .

CMD node apps/msgops-tracker/dist/main
