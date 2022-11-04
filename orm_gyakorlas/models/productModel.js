module.exports = (sequelize,DataTypes) =>{
    const Product = sequelize.define('Product', {
        // Model attributes are defined here
        category: {
          type: DataTypes.STRING
          
        },
        produtsname: {
          type: DataTypes.STRING
        },
        amount:{
            type:DataTypes.INTEGER
        },
        price:{
            type:DataTypes.DOUBLE
        },
        link:{
            type:DataTypes.STRING
        },
        status:{
            type:DataTypes.BOOLEAN
        }
      }, {
        // Other model options go here
        tableName: 'products'
      });

      return Product;
}