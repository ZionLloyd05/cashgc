import { Router, Request, Response } from "express";
import { IRoute } from "./IRoute";

export class PublicRoute implements IRoute {
  initialize(router: Router): void {
    router.get("/", this.serveHomeView.bind(this));
    router.get("/signup", this.serveSignupView.bind(this));
    router.get("/signin", this.serveSignInView.bind(this));
  }

  private serveHomeView(req: Request, res: Response) {
    res.render("index", { title: "Home" });
    // res.render({})
  }

  private serveSignupView(req: Request, res: Response) {
    res.send("sign up view");
  }

  private serveSignInView(req: Request, res: Response) {
    res.send("sign in view");
  }
}
