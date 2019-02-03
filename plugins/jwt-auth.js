const validate = (decoded, request) => {
	return { isValid: true, ...decoded }; // spread operator
}

module.exports = {
	register: (server) => {
		server.auth.strategy('jwt', 'jwt', {
	  	key: process.env.JWT_SECRET,
	    validate,
	    verifyOptions: { algorithms: [ 'HS256' ] }
	  });
	},
	name: 'jwt-auth'
}