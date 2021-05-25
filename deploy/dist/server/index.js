"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = require("./../config/passport");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");
const expressMySQLSession = require("express-mysql-session");
const flash = require("connect-flash");
const routes_1 = require("../routes");
const config_1 = require("../config");
const validator = require("express-validator");
exports.default = ({ app }) => __awaiter(this, void 0, void 0, function* () {
    /**
     * Health Check Routes
     */
    app.get("/status", (req, res) => {
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
        connectionLimit: 1000,
        connectTimeout: 60 * 60 * 1000,
        acquireTimeout: 60 * 60 * 1000,
        timeout: 60 * 60 * 100000,
        host: process.env.HOST,
        port: process.env.DBPORT,
        user: process.env.UNAME,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    };
    const sessionStore = new MySQLStore(options);
    app.use(session({
        secret: config_1.default.secret,
        key: config_1.default.key,
        resave: false,
        saveUninitialized: false,
        store: sessionStore
    }));
    // Passport Setup
    passport_1.PassportConfig.bootstrap(passport);
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
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
    // Load routes
    routes_1.ROUTERS.forEach(router => {
        router.initialize(app);
    });
    // app.use(config.route.prefix, routes);
    /// catch 404 and forward to error handler
    app.use((req, res, next) => {
        const err = new Error("Not Found");
        err.status = 404;
        next(err);
    });
    /// error handlers
    app.use((err, req, res, next) => {
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
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({
            errors: {
                message: err.message
            }
        });
    });
});
//# sourceMappingURL=index.js.map