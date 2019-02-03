const article = require('../controllers/article');
module.exports = {
		home : {
			handler : article.showAll
		}
}