FROM node:22.10.0-bookworm-slim AS base
# inherited by any image that uses this as FROM
WORKDIR /usr/src/app

# By copying only the package.json and package-lock.json here, we ensure that the following `-deps` steps are independent of the source code.
# Therefore, the `-deps` steps will be skipped if only the source code changes.
COPY package.json package-lock.json ./

FROM base AS prod-deps
RUN npm install --omit=dev

FROM base AS build-deps
RUN npm install

FROM build-deps AS build
COPY . .
RUN npm run build

# docker compose will use this as the image for the container (the last image in a multi-build dockerfile)
FROM base AS runtime
# setting owner of files that are copied. node user is non-root
# saves a layer, rather that running seperate RUN chown -R node /usr/src/app
COPY --from=prod-deps --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=node:node /usr/src/app/dist ./dist

# dont think I need these. I expose in compose
# allows it to be accessed from outside the container??? needed it to work but check docks for reason TODO
ENV HOST=0.0.0.0
# ENV PORT=4321
# EXPOSE 4321
# ---------------------------------------- from vscode example
# change owner 
# RUN chown -R node /usr/src/app
USER node
# ----------------------------------------
# TODO exclude CMD and run it in compose file if wanting to use ssl cert.
# if no certs, then below CMD is good
# CMD node ./dist/server/entry.mjs

# end result is a runtime container that has the following:
# usr/src/app/
# node_modules/
# dist/ 
# /client
# /server