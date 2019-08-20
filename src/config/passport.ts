import * as Passport from "passport";
import { User, IUserDTO } from "./../models/User";
import { UserService } from "./../services/user.service";
import { Strategy, IStrategyOptions, VerifyFunction } from "passport-local";

import { Request, Response, NextFunction } from "express";
import { inject } from "inversify";
import DIContainer from "../container/DIContainer";

export class PassportConfig {
	private static _userService: UserService = DIContainer.resolve<UserService>(
		UserService
	);

	static bootstrap = (passport: Passport.PassportStatic) => {
		passport.serializeUser<User, number>((user: IUserDTO, done) => {
			done(null, user.id);
		});

		passport.deserializeUser<User, number>(async (id: number, done) => {
			await PassportConfig._userService
				.getById(id)
				.then(user => {
					let userDto: IUserDTO;
					userDto = { ...user };
					console.log(userDto);
					done(null, userDto);
				})
				.catch(err => done(err, null));
		});

		let options: IStrategyOptions = {
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true
		};

		let verifySignUp: VerifyFunction = (
			req: Request,
			username: string,
			password: string,
			done
		) => {
			process.nextTick(async () => {
				await PassportConfig._userService
					.isExist(username)
					.then(async isExist => {
						if (isExist) {
							return done(
								null,
								false,
								req.flash("error", "Email already exist")
							);
						} else {
							let newUser = new User();
							let newPhone = req.body.phoneCode + "" + req.body.phone;
							req.body.phone = newPhone;
							newUser = {
								...req.body
							};
							await PassportConfig._userService
								.create(newUser)
								.then(async user => {
									let userDto: IUserDTO;
									userDto = { ...user };
									return done(null, userDto);
								})
								.catch(error => done(error, null));
						}
					});
			});
		};

		let verifySignIn: VerifyFunction = (
			req: Request,
			email: string,
			password: string,
			done
		) => {
			process.nextTick(async () => {
				await PassportConfig._userService
					.authenticate(email, password)
					.then(user => {
						if (Object.keys(user).length > 0) {
							let userDto: IUserDTO;
							userDto = { ...user };
							return done(null, userDto);
						} else {
							return done(
								null,
								null,
								req.flash("error", "Incorrect Credentials")
							);
						}
					})
					.catch(err => {
						console.log(err);
						return done(null, err);
					});
			});
		};

		passport.use("local-signup", new Strategy(options, verifySignUp));
		passport.use("local-signin", new Strategy(options, verifySignIn));
	};
}
