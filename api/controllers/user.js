const User = require('../../models').user;

const login = (request,h) => {
	const username = request.payload.username;
 	return User.findOne({where : {username} })
 	.then( (user) => {
 		if (user) {return user;}
 		return "failed to login"
 	})
 	.catch(console.log);
}



const register = (request,h) => {
	
	 return User.create({
		fullname : request.payload.fullname,
		username : request.payload.username,
		password : request.payload.password,
		createdAt : new Date(),
		updatedAt : new Date(),

	})
	.then( (user) => {
		return "sucess!"
	})
	
	 
}


module.exports = {
	login,register
}