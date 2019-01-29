const Hapi = require('hapi');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const Boom = require('boom');
const authBasic = require('hapi-auth-basic');
const authCookie = require('hapi-auth-cookie');
const Bcrypt = require('bcryptjs')

const {Article} = require('./Model/Articles.js')

const server = Hapi.server({
  port : 3000,
  host: 'localhost'
});

const users = {
  andreas : {
    username: 'andreas@gmail.com',
password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm',   // 'secret'
name: 'andreas tihor',
id: '1'
}
};

const runServer = async () => {

  await server.register(authCookie);
  await server.register(authBasic);
  server.auth.strategy('simple','basic' , {validate});
  server.auth.strategy('restricted', 'cookie',{
    password : '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm',
    cookie : 'session',
    isSecure : false,
    
// biar ga redirect ke route yg pake try mode di strategy
// redirectOnTry : false (error) 
});

  try {
    server.route({
      method: 'POST',
      path: '/login',

      options : {
        handler : (req,res) => {
          const user = users[req.payload.username];
          const token = jwt.sign(user , 'secret');
          return token
          req.cookieAuth.set({token});
          return res.redirect('/');
        },

        validate: {
          payload: {
            username : Joi.string().required(), //email({minDomainsAtoms: 2})
            password : Joi.string().alphanum().required()
          }
        },

        auth : 'simple'
      }

    });

    server.route({
      method: 'POST',
      path: '/register',

      options :  {

        handler : (req,res) => {

          const user = {
            fullname : res.payload.fullname,
            email : res.payload.email,
            password : Bcrypt(res.payload.password),
            dob : res.payload.dob
          }



        },

        validate : {
          payload : {
            fullname : Joi.string().min(5).required(),
            password : Joi.string().alphanum().required().min(8),
            username : Joi.string().min(5).required(),
            email : Joi.string().min(5).required().email({minDomainsAtoms: 2}),
            dob : Joi.number()
          }
        },

        auth : 'restricted'
      }
    })
  } catch(err) {
    console.log(err);
    process.exit(1);
  }
  await server.start();

  console.log(`server is running on ${server.info.uri}`);
}

const validate = async (request, username, password) => {


  const user = users[username];
  if (!user) {
    return { credentials: null, isValid: false };
  }

  const isValid = await Bcrypt.compare(password, user.password);
  const credentials = { id: user.id, name: user.name };

  return { isValid, credentials };
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







runServer();