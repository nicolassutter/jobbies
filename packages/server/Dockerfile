FROM node:22-alpine as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY . /usr/src/app
WORKDIR /usr/src/app
RUN pnpm install --frozen-lockfile --prod
# RUN pnpm build --filter=@internal/server
EXPOSE 8888
# mount /usr/src/app/packages/server/data to a volume to persist data
CMD [ "pnpm", "--filter", "@internal/server", "railway:start" ]
