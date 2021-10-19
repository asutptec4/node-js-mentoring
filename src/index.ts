import express, { Application } from 'express';
import userRouter from './routes/user-router';

const app: Application = express();
const port = process.env.PORT || 3000;

app.use('/api/user', userRouter);

app.listen(port, (): void => {
  console.log(`Server Running on https://localhost:${port}`);
});
