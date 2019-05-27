import { AuthService } from "./../services/auth.service";
import { Router, Request, Response, NextFunction } from "express";
import { IRoute } from "./IRoute";
import DIContainer from "../container/DIContainer";

export class UserRoute implements IRoute {
  private _authService: AuthService = DIContainer.resolve<AuthService>(
    AuthService
  );
  initialize(router: Router): void {
    router.get(
      "/user",
      this._authService.mustBeLoggedIn,
      this.serveDashboardView.bind(this)
    );

    router.get(
      "/user/store",
      this._authService.mustBeLoggedIn,
      this.serveStoreView.bind(this)
    );

    router.get(
      "/user/cart",
      this._authService.mustBeLoggedIn,
      this.serveCartView.bind(this)
    );
  }

  private serveDashboardView(req: Request, res: Response) {
    res.render("user/index", {
      title: "Dashboard",
      layout: "userLayout",
      isDashboard: true
    });
  }

  private serveStoreView(req: Request, res: Response) {
    res.render("user/store", {
      title: "Dashboard",
      layout: "userLayout",
      isStore: true
    });
  }

  private serveCartView(req: Request, res: Response) {
    res.render("user/cart", {
      title: "Cart",
      layout: "userLayout",
      isStore: true
    });
  }
}
