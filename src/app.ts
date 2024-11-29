import express from 'express';
import https from 'https';
import fs from 'fs';
import ApiRoutes from './routes/api.route';
import expressListRoutes from 'express-list-routes';
import cors, { CorsOptions } from 'cors';

// CORS настройки
const corsOptions: CorsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

const app = express();

app.use(express.json());
app.use(cors(corsOptions));

app.use('/api/', ApiRoutes);

// Путь к сертификатам
const sslOptions = {
    key: fs.readFileSync('/app/certs/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/app/certs/fullchain.pem', 'utf8'),
};

// Порт для HTTPS
const PORT = process.env.PORT || 3000;

// Запуск HTTPS-сервера
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`--------------------------------------`);
    console.log(`|    RTMP Live Stream (HTTPS)    |`);
    console.log(`--------------------------------------`);
    console.log(`Log file is located at: ./logs/app.log`);
    console.log(`Routes:`);

    expressListRoutes(app, { prefix: `https://localhost:${PORT}` });
});
