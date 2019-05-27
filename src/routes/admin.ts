import { AuthService } from "./../services/auth.service";
import { Router, Request, Response } from "express";
import { IRoute } from "./IRoute";
import DIContainer from "../container/DIContainer";

export class AdminRoute implements IRoute {
  private _authService: AuthService = DIContainer.resolve<AuthService>(
    AuthService
  );
  initialize(router: Router): void {
    router.get(
      "/admin",
      this._authService.mustBeLoggedIn,
      this.serveDashboardView.bind(this)
    );

    router.get(
      "/admin/gc/categories",
      this._authService.mustBeLoggedIn,
      this.serveCategoryView.bind(this)
    );
  }

  private serveDashboardView(req: Request, res: Response) {
    res.render("admin/index", {
      title: "Dashboard",
      layout: "adminLayout",
      isDashboard: true
    });
  }

  private serveCategoryView(req: Request, res: Response) {
    res.render("admin/gccategory", {
      title: "GC Category",
      layout: "adminLayout",
      isCategory: true
    });
  }
}
