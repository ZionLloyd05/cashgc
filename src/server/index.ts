import { DatabaseProvider } from "./../database/index";
import { PassportConfig } from "./../config/passport";
import * as express from "express";
import { Request, Response } from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as morgan from "morgan";
import * as cookieParser from "cookie-parser";
import * as path from "path";
import * as passport from "passport";
import * as session from "express-session";
import * as expressMySQLSession from "express-mysql-session";
import * as flash from "connect-flash";
import { ROUTERS } from "../routes";
import config from "../config";
import * as validator from "express-validator";

export default async ({ app }: { app: express.Application }) => {
	/**
	 * Health Check Routes
	 */
	app.get("/status", (req: Request, res: Response) => {
		res.status(200).send("hello");
	});
	app.head("/status", (req, res) => {
		res.status(200).end();
	});

	app.use(validator());

	// Enable Cross Origin Resource Sharing to all origins by default
	app.use(cors());

	app.use(morgan("dev"));

	app.use(cookieParser());

	// Middleware that transform the raw string of req.body into a json
	app.use(bodyParser.json());

	// User query string parser
	app.use(bodyParser.urlencoded({ extended: true }));

	// Setting up session store for express
	const MySQLStore = expressMySQLSession(session);

	var options = {
		connectionLimit : 1000,
		connectTimeout  : 60 * 60 * 1000,
		acquireTimeout  : 60 * 60 * 1000,
		timeout         : 60 * 60 * 100000,
		host: process.env.HOST,
		port: process.env.DBPORT,
		user: process.env.UNAME,
		password: process.env.PASSWORD,
		database: process.env.DATABASE
	};

	const sessionStore = new MySQLStore(options);

	app.use(
		session({
			secret: config.secret,
			key: config.key,
			resave: false,
			saveUninitialized: false,
			store: sessionStore
		})
	);

	// Passport Setup
	PassportConfig.bootstrap(passport);
	app.use(passport.initialize());
	app.use(passport.session());

	// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
	// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
	app.use((req, res, next) => {
		if (req.cookies.connect_dd && !req.user) {
			res.clearCookie("connect-dd");
		}
		next();
	});

	// // The flash middleware let's us use req.flash('error', 'Shit!'), which will then pass that message to the next page the user requests
	app.use(flash());

	// pass variables to our templates + all requests
	app.use((req, res, next) => {
		res.locals.flashes = req.flash();
		res.locals.user = req.user || null;
		res.locals.isLoggedIn = req.isAuthenticated();
		next();
	});

	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept"
		);
		next();
	});


	// Load routes
	ROUTERS.forEach(router => {
		router.initialize(app);
	});
	// app.use(config.route.prefix, routes);

	/// catch 404 and forward to error handler
	app.use((req: Request, res: Response, next: any) => {
		const err = new Error("Not Found") as any;
		err.status = 404;
		next(err);
	});

	/// error handlers
	app.use((err: any, req: Request, res: Response, next: any) => {
		/**
		 * Handle 401 thrown by express-jwt library
		 */
		if (err.name === "UnauthorizedError") {
			return res
				.status(err.status)
				.send({ message: err.message })
				.end();
		}
		return next(err);
	});

	app.use((err: any, req: Request, res: Response, next: any) => {
		res.status(err.status || 500);
		res.json({
			errors: {
				message: err.message
			}
		});
	});
};
