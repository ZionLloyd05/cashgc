import { Router, Request, Response, NextFunction } from "express";
import { injectable } from "inversify";

@injectable()
export class AuthService {
  public mustBeLoggedIn(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/signin");
    }
  }
}
