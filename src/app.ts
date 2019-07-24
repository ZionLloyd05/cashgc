import "reflect-metadata";
import { DatabaseProvider } from "./database";
import config from "./config";
import * as express from "express";
import * as paypal from "paypal-rest-sdk";

async function startServer() {
	/**
	 * Database configuration
	 */
	DatabaseProvider.configure({
		type: "mysql",
		database: config.database,
		username: config.username,
		password: config.password,
		host: config.host,
		port: config.dbport
	});

	/**
	 * PayPal configuration
	 */
	paypal.configure({
		mode: config.mode, //sandbox or live
		client_id: config.client_id,
		client_secret: config.client_secret
	});

	const app = require("./config/viewsetup").default();
	await require("./server").default({ app });

	app.listen(config.port, err => {
		if (err) {
			console.log("got an error");
			console.log(err);
			process.exit(1);
			return;
		}

		console.log("-------------------------------------------------------");
		console.log(" ( :  Server listening on port: ", config.port, " : ) ");
		console.log("-------------------------------------------------------");
	});

	try {
		await DatabaseProvider.getConnection();
		console.log("Database connected");
	} catch (error) {
		console.log("error");
		console.log(error);
	}
}

startServer();
