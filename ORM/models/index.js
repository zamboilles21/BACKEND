const Sequelize  = require('sequelize');
const sequelize = new Sequelize('2123szft_orm', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
  });

  db.sequelize.sync();
  const db={}

  db.sequelize=sequelize;
  db.models={};
  db.models.User=require('./userModel')(sequelize, sequelize.DataTypes);

  module.exports=db;
