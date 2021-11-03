import express, { Application } from 'express';
import userRouter from './routes/user-router';
import config from './config';

const app: Application = express();
const port = config.port;

app.use('/api/user', userRouter);

app.listen(port, (): void => {
  console.log(`Server Running on http://localhost:${port}`);
});
