# Alpine Linux is much smaller than most distribution base images.
ARG NODE_VERSION=latest

FROM node:$NODE_VERSION

# Provide default arguments if image was not built by docker compose.
ARG CLEAN_NPM_CACHE=false
ARG ENABLE_TYPESCRIPT=false
ARG HOST=0.0.0.0
ARG PROJECT_PATH=/project
ARG VUE_CLI_VERSION=latest

# Environment variables
ENV CLEAN_NPM_CACHE=$CLEAN_NPM_CACHE
ENV ENABLE_TYPESCRIPT=$ENABLE_TYPESCRIPT
ENV HOST=$HOST
ENV PROJECT_PATH=$PROJECT_PATH
ENV VUE_CLI_VERSION=$VUE_CLI_VERSION

# Directory Setup
RUN mkdir -p ${PROJECT_PATH}
WORKDIR ${PROJECT_PATH}

COPY . .

# Setup Vue CLI
RUN npm install -g @vue/cli@${VUE_CLI_VERSION}

# Add TypeScript support
RUN if [ "${ENABLE_TYPESCRIPT}" = "true" ]; then npm install -g typescript; fi

# If existing vue project, install dependencies
RUN if [ -f package.json ]; then npm install; fi

# Clean npm global cache
RUN if [ "${CLEAN_NPM_CACHE}" = "true" ]; then npm cache clean --force; fi

CMD ["npm", "run", "serve"]
