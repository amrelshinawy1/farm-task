import { Response } from "express";
import { transformStringToNumber } from "helpers/utils";
import http from "http";
import config from "./config/config";
import dataSource from "./orm/orm.config";
import { setupServer } from "./server/server";

async function bootstrap(): Promise<http.Server> {
  try {
    const app = setupServer();
    console.log("heer1")
    await dataSource.initialize();
    const port = config.APP_PORT;

    app.get("/", (_, res: Response) => {
      res.send(`Listening on port: ${port}`);
    });
    console.log("heer2")
    const server = http.createServer(app);
    server.listen(port);
    console.log("heer3")
    return server;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

bootstrap();

//1. Please write a function to transform array to containing number and strings.
transformStringToNumber(["super", "20.5", "test", "23" ])
