const Article = require('../../models').article;
const showAll = (request,h) => {
	return Article.findAll();
	// return "A"
}

module.exports = {
	showAll
}