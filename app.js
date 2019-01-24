const Hapi = require('hapi');
const Joi = require('joi');


const {Article} = require('./Model/Articles.js')

const server = Hapi.server({
	port : 3000,
	host: 'localhost'
});

const runServer = async () => {

	
	await server.start();

	console.log(`server is running on ${server.info.uri}`);
}


process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

server.route( {
	method : 'GET',
	path : '/',
	handler : (req,res) => {
		
		const mod = Article.findAll();
		return mod;
	}
});

server.route({
	method: 'GET',
	path: '/login',
	handler : (req,res) => {

		const obj = {name: "login page"};
		return obj;
	}
});

server.route({
	method: 'POST',
	path: '/login',
	config : {
		handler : (req,res) => {

		const obj = req.payload;
		return obj;
		},

		validate: {
			payload: {
				email : Joi.string().email({minDomainsAtoms: 2}).required(),
				password : Joi.string().alphanum().required()
			}
		}
	}
		
});


server.route({
	method: 'GET',
	path: '/register',
	handler : (req,res) => {

		const obj = { name:  "register page" };
		return obj

		
	}
})

server.route({
	method: 'POST',
	path: '/register',
	
	config :  {

	handler : (req,res) => {

		const obj = req.payload;
		return obj;
	},

	validate : {
		payload : {
			name : Joi.string().min(5).required(),
			password : Joi.string().alphanum().required().min(8),
			email : Joi.string().min(5).required().email({minDomainsAtoms: 2}),
			dob : Joi.number()
		}
	}

	}
})



runServer();