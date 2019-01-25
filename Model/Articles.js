const Sequelize = require('sequelize');
const connection = new Sequelize('test','postgres','admin', {
	dialect : 'postgresql'
});




const Article = connection.define('article', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT
});

Article.sync();

module.exports =  {
	Article
}