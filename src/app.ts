import express from 'express';
import ApiRoutes from './routes/api.route'
import expressListRoutes from 'express-list-routes'
import cors, { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};


const app = express();

app.use(express.json());
app.use(cors(corsOptions));

app.use('/api/', ApiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`--------------------------------------`);
    console.log(`|    RTMP Live Stream    |`);
    console.log(`--------------------------------------`);
    console.log(`Log file is located at: ./logs/app.log`);
    console.log(`Routes:`);

    expressListRoutes(app, { prefix: `localhost:${PORT}` });
});


