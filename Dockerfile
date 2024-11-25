FROM node:16
WORKDIR /app

RUN apt-get update && apt-get install -y ffmpeg

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/app.js"]
