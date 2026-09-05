# Build context is the repository root, see the publish job in
# .github/workflows/lint-build-test.yml.

# ---- Build stage ----------------------------------------------------------
FROM node:21 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Chains prebuild:production (npm i) -> build:production (tsc + bundle.sh,
# copies static assets into dist/public) -> postbuild:production (installs
# only express/body-parser into dist/node_modules) - see package.json.
RUN npm run build:production

# ---- Runtime stage ----------------------------------------------------------
FROM node:21

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

USER node

# dist/ becomes the app root: controller.ts resolves its data directory as
# `${__dirname}/data`, so this layout must stay flat (no dist/ subfolder)
# for the ./kcal-data bind mount in my-webservers to keep working.
COPY --from=build --chown=node:node /app/dist .

EXPOSE 8080

CMD ["node", "index.js"]
