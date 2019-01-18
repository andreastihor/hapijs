const Hapi = require('hapi');


const {Article} = require('./Model/Articles.js')

const server = Hapi.server({
	port : 3000,
	host: 'localhost'
});

const runServer = async () => {

	await server.register(require('inert'));
	await server.register(require('vision'));
	await server.start();

	server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'View',

    });

	console.log(`server is running on ${server.info.uri}`);
}


// process.on('unhandledRejection', (err) => {

//     console.log(err);
//     process.exit(1);
// });

server.route( {
	method : 'GET',
	path : '/',
	handler : (req,res) => {
		// return res.file('./View/home.html');
		const mod = Article.findAll();
		
		 return res.view('home',{articles : mod } );
	}
});

server.route({
	method: 'GET',
	path: '/login',
	handler : (req,res) => {
		return res.file('View/login.html');
	}
});

server.route({
	method: 'POST',
	path: '/login',
	handler : (req,res) => {
		return "LOGIN HERE";
	}
});


server.route({
	method: 'GET',
	path: '/register',
	handler : (req,res) => {
		return res.file('./View/register.html');
	}
})

server.route({
	method: 'POST',
	path: '/register',
	handler : (req,res) => {
		return "Register here! "
	}
})



runServer();