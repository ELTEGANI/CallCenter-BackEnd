'use strict';
module.exports = (sequelize, DataTypes) => {
  const companies = sequelize.define('companies', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      allowNull: false,
    },
    companyPhone:{
        type:DataTypes.STRING,
        allowNull: false,
      },
    companyName: {
    type:DataTypes.STRING,
    allowNull: false,
    },
    password:{
    type:DataTypes.STRING,
    allowNull: false,
    },
    bussinessType:{
      type:DataTypes.STRING,
      allowNull: false,
    },
    ownerPhone:{
    type:DataTypes.STRING,
    allowNull: false,
    },
    ownerName:{
      type:DataTypes.STRING,
      allowNull: false,
      },
    ownerEmail:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    isCompanyVisible:{
      type:DataTypes.STRING,
      allowNull: false,
    }
  }, {});
  companies.associate = function(models) {
    // associations can be defined here
    companies.hasMany(models.inboxes, { foreignKey: 'companyid', targetKey: 'id' });
    companies.hasOne(models.menus, { foreignKey: 'companyid', targetKey: 'id' });
  };
  return companies;
};