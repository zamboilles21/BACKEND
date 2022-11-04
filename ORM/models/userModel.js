module.exports=(sequelize, DataTypes)=>{
    const User = sequelize.define('User', {
        
        firstName: {
          type: DataTypes.STRING
          
        },
        lastName: {
          type: DataTypes.STRING
          
        },
        age: {
            type: DataTypes.INTERGER
            
          }
      }, {
        // Other model options go here
        tableName: 'users'
      });
      return User;
}