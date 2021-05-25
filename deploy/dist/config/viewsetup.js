"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const expressHbs = require("express-handlebars");
/**
 * Express View SetUp
 */
function default_1() {
    var app = express();
    // view engine setup
    app.engine(".hbs", expressHbs({
        defaultLayout: "layout",
        extname: ".hbs"
    }));
    app.set("view engine", "hbs");
    app.set("views", path.join(__dirname, "../../src/views"));
    app.use(express.static(path.join(__dirname, "../../src/public")));
    return app;
}
exports.default = default_1;
//# sourceMappingURL=viewsetup.js.map