const Hapi = require('hapi');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const Boom = require('boom');
const authBasic = require('hapi-auth-basic');
const authCookie = require('hapi-auth-cookie');
const Bcrypt = require('bcryptjs')

const {Article} = require('./models/Articles.js')
const {User} = require('./models/User.js')

const server = Hapi.server({
  port : 3000,
  host: 'localhost'
});



const validateJWT = async function (decoded, request) {
  return { isValid: true, ...decoded };
};

const runServer = async () => {

  await server.register(authCookie);
  await server.register(authBasic);
  server.auth.strategy('simple','basic' , {validate});
  server.auth.strategy('restricted', 'cookie',{
    password : '$2a$10$JwbwopKOwGepKZ/bRbFjB.1Av0HMxxbmGYDeofT55db1WdPEmIf82',
    cookie : 'session',
    isSecure : false,
    
	// biar ga redirect ke route yg pake try mode di strategy
	// redirectOnTry : false (error) 
	});

	await server.register(require('hapi-auth-jwt2'));
  server.auth.strategy('jwt', 'jwt', {
  	key: 'secret',          // Never Share your secret key
    validate: validateJWT,            // validate function defined above
    verifyOptions: { algorithms: [ 'HS256' ] } // pick a strong algorithm
  });

  
  server.route({
    method : 'GET',
    path : '/restricted' , 
    options : {
      handler : (request,h) => {
        return "restricted page!"
      },
      auth :'restricted'
    }
  })

  server.route({
  	method: 'GET',
  	path: '/decoded',
  	handler: (request, h) => {
  		console.log(request.auth.credentials)
  		return 'test';
  	},
  	options: {
  		auth: 'jwt'
  	}
  })

  try {
    server.route({
      method: 'POST',
      path: '/login',

      options : {
        handler : (request, h) => {
        	const { username } = request.payload;
        	return User.findOne({ where: { username } })
        		.then(user => {
        			const { username, id, email, fullname } = user;
        			const token = jwt.sign({ username, email, fullname, id }, 'secret');
        			console.log(token)
        			request.cookieAuth.set({token});
        		})
        	
        },

        validate: {
          payload: {
            username : Joi.string().required(), //email({minDomainsAtoms: 2})
            password : Joi.string().alphanum().required()
          }
        }
      }

    });

  } catch(err) {
    console.log(err);
    process.exit(1);
  }
  await server.start();

  console.log(`server is running on ${server.info.uri}`);
}

const validate = async (request, username, password) => {

  User.findOne({
    where : {username}
  })
  .then((user) => {
    const isValid =  Bcrypt.compareSync(password, user.password);
    const credentials = { id: user.id, name: user.name };

    return { isValid, credentials };
  });
  // const user = users[username];
  // if (!user) {
  //   return { credentials: null, isValid: false };
  // }

  // const isValid = await Bcrypt.compareSync(password, user.password);
  // const credentials = { id: user.id, name: user.name };

  // return { isValid, credentials };
};


server.route( {
  method : 'GET',
  path : '/',
  options : {
    handler : (req,res) => {

      const mod = Article.findAll();
    
      return mod;
    },



  }
});

server.route({
      method: 'POST',
      path: '/register',

      options :  {

        handler : (req,res) => {

        	const salt = Bcrypt.genSaltSync(10);
					const hash = Bcrypt.hashSync(req.payload.password, salt);
        	
          const user = {
            fullname : req.payload.fullname,
            email : req.payload.email,
            password : hash,
            dob : req.payload.dob,
            username : req.payload.username

            
          }

          User.create({
            	fullname : user.fullname,
            	email : user.email,
            	password : user.password,
            	dob : user.dob,
            	username : user.username
           });
          
          return res.redirect('/')
        },

        validate : {
          payload : {
            fullname : Joi.string().min(5).required(),
            password : Joi.string().alphanum().required().min(5),
            username : Joi.string().min(5).required(),
            email : Joi.string().min(5).required().email({minDomainsAtoms: 2}),
            dob : Joi.number()
          }
        },

       
      }
    })


runServer();