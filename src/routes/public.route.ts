import { Router, Request, Response, NextFunction } from "express";
import { IRoute } from "./IRoute";
import * as passport from "passport";

export class PublicRoute implements IRoute {
  initialize(router: Router): void {
    router.get("/", this.serveHomeView.bind(this));
    router.get("/signup", this.serveSignupView.bind(this));
    router.get("/signin", this.serveSignInView.bind(this));
    router.post(
      "/signin",
      passport.authenticate("local-signin", {
        successRedirect: "/",
        failureRedirect: "/signin",
        failureFlash: true
      })
    );
  }

  private serveHomeView(req: Request, res: Response) {
    console.log(req);
    console.log(req.isAuthenticated());
    res.render("index", { title: "Home" });
    // res.render({})
  }

  private serveSignupView(req: Request, res: Response) {
    res.render("signup", {
      title: "Sign Up",
      layout: "authLayout"
    });
  }

  private serveSignInView(req: Request, res: Response) {
    res.render("signin", {
      title: "Sign In",
      layout: "authLayout"
    });
  }

  // private signin(req: Request, res: Response, next: NextFunction) {
  //   passport.authenticate("local-signin", {
  //     successRedirect: "/",
  //     failureRedirect: "/signin",
  //     failureFlash: true
  //   })(req, res, next);
  // }

  // private isLoggedIn(req: Request, res: Response, next: NextFunction){
  //   if(req.isAuthenticated()){
  //     next()
  //   }else{
  //     res.redirect
  //   }
  // }
}
