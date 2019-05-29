import { Router, Request, Response, NextFunction } from "express";
import { injectable } from "inversify";

@injectable()
export class AuthService {
	public mustBeLoggedIn(req: Request, res: Response, next: NextFunction) {
		console.log(req.url);
		console.log(req.baseUrl);
		console.log("user from authservice");
		console.log(req.user);
		if (req.isAuthenticated()) {
			next();
		} else {
			res.redirect("/signin");
		}
	}

	// public redirectTo()
}
