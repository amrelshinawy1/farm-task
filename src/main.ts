import { Response } from "express";
import { containsNumbers, findFilesInDir, transformStringToNumber } from "helpers/utils";
import http from "http";
import config from "./config/config";
import dataSource from "./orm/orm.config";
import { setupServer } from "./server/server";

async function bootstrap(): Promise<http.Server> {
  try {
    const app = setupServer();
    await dataSource.initialize();
    const port = config.APP_PORT;

    app.get("/", (_, res: Response) => {
      res.send(`Listening on port: ${port}`);
    });
    const server = http.createServer(app);
    server.listen(port);
    console.log(`Start Listening on port: ${port}`)
    return server;
  } catch (error) {
    console.log(error)
    throw error;
  }
}

bootstrap();

//1. Please write a function to transform array to containing number and strings.
transformStringToNumber(["super", "20.5", "test", "23" ])


//2. Please write a function to return an array of all `.csv` files in folder `/files`
findFilesInDir("./files", ".csv")


//3. Please write a function to return if a string contains a digit
containsNumbers("test-string")
containsNumbers("test-string23")
