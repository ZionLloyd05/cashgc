import * as express from "express";
import { Request, Response } from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as morgan from "morgan";
import { ROUTERS } from "../routes";

export default async ({ app }: { app: express.Application }) => {
  /**
   * Health Check Routes
   */
  app.get("/status", (req: Request, res: Response) => {
    res.status(200).send("hello");
  });
  app.head("/status", (req, res) => {
    res.status(200).end();
  });

  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  app.use(morgan("dev"));

  // Middleware that transform the raw string of req.body into a json
  app.use(bodyParser.json());

  // Load routes
  ROUTERS.forEach(router => {
    router.initialize(app);
  });
  // app.use(config.route.prefix, routes);

  /// catch 404 and forward to error handler
  app.use((req: Request, res: Response, next: any) => {
    const err = new Error("Not Found") as any;
    err.status = 404;
    next(err);
  });

  /// error handlers
  app.use((err: any, req: Request, res: Response, next: any) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === "UnauthorizedError") {
      return res
        .status(err.status)
        .send({ message: err.message })
        .end();
    }
    return next(err);
  });

  app.use((err: any, req: Request, res: Response, next: any) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message
      }
    });
  });
};
