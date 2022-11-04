module.exports = (sequelize,DataTypes) =>{
    const User = sequelize.define('User', {
        // Model attributes are defined here
        firstName: {
          type: DataTypes.STRING
          
        },
        lastName: {
          type: DataTypes.STRING
        },
        age:{
            type:DataTypes.INTEGER
        }
      }, {
        // Other model options go here
        tableName: 'users'
      });

      return User;
}