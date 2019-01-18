const Sequelize = require('sequelize');
const connection = new Sequelize('sequelize','root','', {
	dialect : 'mysql'
});




const Article = connection.define('article', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT
});

Article.sync();

module.exports =  {
	Article
}