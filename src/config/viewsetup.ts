import * as express from "express";
import * as path from "path";
import * as expressHbs from "express-handlebars";

/**
 * Express View SetUp
 */
export default function() {
	var app: express.Express = express();

	// view engine setup
	app.engine(
		".hbs",
		expressHbs({
			defaultLayout: "layout",
			extname: ".hbs"
		})
	);
	app.set("view engine", "hbs");
	app.set("views", path.join(__dirname, "../../src/views"));

	app.use(express.static(path.join(__dirname, "../../src/public")));

	return app;
}
