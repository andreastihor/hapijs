const db = require('./DB.js');
const Sequelize = require('sequelize')

const Article = db.define('article', {
  title: Sequelize.TEXT,
  description: Sequelize.TEXT
});

Article.sync();

module.exports =  {
	Article
}