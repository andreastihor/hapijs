'use strict';
require('dotenv').config();
const Hapi = require('hapi');

// Create a server with a host and port
const server = Hapi.server({
	host: process.env.HOST,
	port: process.env.PORT
});

// Start the server
const start =  async () => {
	try {
		await server.register(require('hapi-auth-jwt2'));
		await server.register(require('./plugins/jwt-auth'));
		
		await server.register(require('./api'));

		await server.start();
	}
	catch (err) {
		console.log(err);
		process.exit(1);
	}

	console.log(`server is running on ${server.info.uri}`);
}

start();
