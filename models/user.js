'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('Users', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      allowNull: false,
      },
    phone_number:{
      type: DataTypes.STRING,
      allowNull: false
    },
    gender:{
      type: DataTypes.STRING,
      allowNull: false
    },
    age:{
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};