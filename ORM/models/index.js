const Sequelize  = require('sequelize');
const sequelize = new Sequelize('2123szft_orm', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
  });

  
  const db={}

  db.sequelize=sequelize;
  db.models={};
  db.models.User=require('./userModel.js')(sequelize, sequelize.DataTypes);

  module.exports=db;
