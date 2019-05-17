import { User } from "./../models/User";
// // Import only what we need from express
import { Router, Request, Response } from "express";
import { IRoute } from "./IRoute";
import DIContainer from "../container/DIContainer";
import { UserController } from "../controllers/user.ctrl";

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
    let nuser = new User();
    nuser = {
      firstname: "Toba",
      lastname: "Leke",
      email: "tobalee@gmail.com",
      address: "las vegas",
      city: "juventus",
      state: "spain",
      country: "america",
      password: "lisha123"
    };

    // nuser = { ...req };
    try {
      //await userService.update(nuser);

      this._userController.saveUser(nuser).then(user => {
        res.json(user);
      });
    } catch (error) {
      console.log(error);
    }
  }
}
