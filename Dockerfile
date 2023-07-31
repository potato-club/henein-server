# Install dependencies only when needed
FROM docker.io/node:lts-alpine as deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat g++ make py3-pip
COPY ./ ./
RUN yarn install --frozen-lockfile
RUN yarn nx build info --prod

# Production image, copy all the files and run nest
FROM docker.io/node:lts-alpine as runner
RUN apk add --no-cache dumb-init
ENV NODE_ENV production
ENV PORT 3000
ENV DATABASE_URL postgresql://
ENV REDIS_HOST a
ENV REDIS_PORT 6379
ENV REDIS_PASSWORD a
ENV REDIS_USERNAME a
WORKDIR /usr/src/app
COPY --from=deps /dist/apps/info/node_modules ./node_modules
COPY --from=deps /dist/apps/info/package.json ./package.json
COPY dist/apps/info .
RUN yarn install --frozen-lockfile
RUN yarn prisma generate
RUN chown -R node:node .
USER node
EXPOSE 3000
CMD ["dumb-init", "node", "main.js"]
