// // Import only what we need from express
import { Router, Request, Response } from "express";
import { IRoute } from "./IRoute";
import DIContainer from "../container/DIContainer";
import { UserController } from "../controllers/user.ctrl";

// // Assign router to the express.Router() instance
// const router: Router = Router();

// // The / here corresponds to the route that the WelcomeController
// // is mounted on in the server.ts file.
// // In this case it's /welcome
// router.get("/", (req: Request, res: Response) => {
//   // Reply with a hello world when no name param is provided
//   res.send("Hello, World!");
// });

// router.get("/:name", (req: Request, res: Response) => {
//   // Extract the name from the request parameters
//   let { name } = req.params;

//   // Greet the given name
//   res.send(`Hello, ${name}`);
// });

// // Export the express.Router() instance to be used by server.ts
// export const IndexRoute: Router = router;

export class PingRoute implements IRoute {
  protected _userController: UserController = DIContainer.resolve<
    UserController
  >(UserController);

  initialize(router: Router): void {
    router.get("/", this.home.bind(this));
  }

  /**
   * Router Functions
   */
  private home(req: Request, res: Response) {
    res.send("Hello Bro!");
  }
}
