'use strict';
module.exports = (sequelize, DataTypes) => {
  const menu = sequelize.define('menu', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      allowNull: false,
    },
    questions:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    answers:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    questionorder:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyid:{
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {});
  menu.associate = function(models) {
    // associations can be defined here
    menu.belongsTo(models.companies, { foreignKey: 'companyid', targetKey: 'id' });
  };
  return menu;
};