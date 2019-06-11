import { Router, Request, Response, NextFunction } from "express";
import { IRoute } from "./IRoute";
import * as passport from "passport";

import * as csurf from "csurf";

export class PublicRoute implements IRoute {
  initialize(router: Router): void {
    const csrfProtection = csurf();
		router.use(csrfProtection);

    router.get("/", this.serveHomeView.bind(this));
    router.get("/signup", this.serveSignupView.bind(this));
    router.get("/signin", this.serveSignInView.bind(this));
    router.get("/logout", this.logout.bind(this));

    router.post(
      "/signin",
      passport.authenticate("local-signin", {
        successRedirect: "/user",
        failureRedirect: "/signin",
        failureFlash: true
      })
    );

    router.post(
      "/signup",
      passport.authenticate("local-signup", {
        successRedirect: "/",
        failureRedirect: "/signin",
        failureFlash: true
      })
    );
  }

  private serveHomeView(req: Request, res: Response) {
    res.render("index", {
      title: "Home",
      csrfToken: req.csrfToken()
    });
  }

  private serveSignupView(req: Request, res: Response) {
    res.render("signup", {
      title: "Sign Up",
      layout: "authLayout"
    });
  }

  private serveSignInView(req: Request, res: Response) {
    var message = req.flash("error");
    res.render("signin", {
      title: "Sign In",
      layout: "authLayout",
      message,
      hasError: message != ""
    });
  }

  private logout(req: Request, res: Response) {
    req.logout();
    res.redirect("/");
  }
}
