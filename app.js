const Hapi = require('hapi');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const Boom = require('boom');
const authBasic = require('hapi-auth-basic');
const authCookie = require('hapi-auth-cookie');

const {Article} = require('./Model/Articles.js')

const server = Hapi.server({
	port : 3000,
	host: 'localhost'
});

const runServer = async () => {

	await server.register(authCookie);
	await server.register(authBasic);
	server.auth.strategy('simple','basic' , {validate});

	try {
	server.route({
	method: 'POST',
	path: '/login',
	
	options : {
		handler : (req,res) => {

			if (req.payload.username != user.username) {
				return Boom.badRequest('Wrong email!');

			}

			if (req.payload.password != user.password) {
				return Boom.badRequest('Wrong Password!');
			}
			const token = jwt.sign({user} , 'secret');
			return token;
		},

		validate: {
			payload: {
				username : Joi.string().email({minDomainsAtoms: 2}).required(),
				password : Joi.string().alphanum().required()
			}
		},

		auth : 'simple'
	}

}); } catch(err) {
		console.log(err);
		process.exit(1);
	}
	await server.start();

	console.log(`server is running on ${server.info.uri}`);
}

const validate = async (request, username, password,reply) => {
// TODO

if (username != user.username) {
	return Boom.badRequest('username not found!');
}

if (password != user.password) {
	return Boom.badRequest('password not match')
}
return user;

}

const user = {
	id : 1,
	username : "andreas@gmail.com",
	password : "tihor",
	status : "admin"
}


server.route( {
	method : 'GET',
	path : '/',
	handler : (req,res) => {

		const mod = Article.findAll();
		return mod;
	}
});








server.route({
	method: 'POST',
	path: '/register',

	config :  {

		handler : (req,res) => {


			const fullname = res.payload.fullname;
			const email = res.payload.email;
			const password = bcrypt(res.payload.password);
			const dob = res.payload.dob;


		},

		validate : {
			payload : {
				fullname : Joi.string().min(5).required(),
				password : Joi.string().alphanum().required().min(8),
				email : Joi.string().min(5).required().email({minDomainsAtoms: 2}),
				dob : Joi.number()
			}
		}

	}
})



runServer();