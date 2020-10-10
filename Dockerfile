FROM library/node:12-alpine as builder

WORKDIR /install

COPY .npmrc package.json package-lock.json tsconfig.json ./
RUN npm i

COPY src ./src/
RUN npm run build

#---------------------------------------------------------------

FROM library/node:12-alpine as finalstage

WORKDIR /app

# copy build files to /app directory
RUN chown node:node /app
COPY --chown=node:node --from=builder /install/ ./

USER node

CMD npm start