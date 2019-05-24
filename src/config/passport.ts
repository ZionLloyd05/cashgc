import * as Passport from "passport";
import { User } from "./../models/User";
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
    passport.serializeUser<User, number>((user: User, done) => {
      console.log("serializing");
      done(null, user.id);
    });

    passport.deserializeUser<User, number>(async (id: number, done) => {
      console.log("deserializing");
      await PassportConfig._userService
        .getById(id)
        .then(user => done(null, user))
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
              return done("Email already exist");
            } else {
              let newUser = new User();
              newUser = {
                ...req.body
              };
              await PassportConfig._userService
                .create(newUser)
                .then(user => done(null, user))
                .catch(error => done(error, null));
            }
          });
      });
    };

    let verifySignIn: VerifyFunction = (
      req: Request,
      user: string,
      password: string,
      done
    ) => {
      process.nextTick(async () => {
        console.log("hey bro");
        await PassportConfig._userService
          .authenticate(user, password)
          .then(user => {
            console.log(user);
            if (user) return done(null, user);
            else return done(null, null);
          })
          .catch(err => {
            return done(null, err);
          });
      });
    };

    passport.use("local-signup", new Strategy(options, verifySignUp));
    passport.use("local-signin", new Strategy(options, verifySignIn));
  };
}
