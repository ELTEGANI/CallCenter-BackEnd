'use strict';
module.exports = (sequelize, DataTypes) => {
  const Statistics = sequelize.define('Statistics', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      allowNull: false,
    },
    questionNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    companyNumber: {
      type:DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Statistics.associate = function(models) {
    Statistics.belongsTo(models.menus, { foreignKey: 'questionNumber', targetKey: 'companyid' });

  };
  return Statistics;
};