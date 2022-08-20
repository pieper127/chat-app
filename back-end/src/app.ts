import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import Connect from "./connect-db";
import apiRouter from "./router";
const app: Application = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiRouter);

const PORT = 3000;
const db = "mongodb://root:root@localhost:27017/";

Connect({ db });

app.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
})