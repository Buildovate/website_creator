FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/aws ./src/aws
COPY --from=build /app/drizzle ./drizzle
COPY --from=build /app/aws ./aws
EXPOSE 8080
USER node
CMD ["node", "src/aws/server.js"]
