'use strict';
module.exports = (sequelize, DataTypes) => {
  const inboxes = sequelize.define('inboxes', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      allowNull: false,
    },
    companyid:{
    type:DataTypes.STRING,
    allowNull: false,
    },
    incomingMessages:{
    type:DataTypes.STRING,
    allowNull: false,
    },
    senderPhone:{
    type:DataTypes.STRING,
    allowNull: false,
    },
    status:{
      type:DataTypes.STRING,
      allowNull: false,
    }
  }, {});
  inboxes.associate = function(models) {
    // associations can be defined here
    inboxes.belongsTo(models.companies, { foreignKey: 'companyid', targetKey: 'id' });

  };
  return inboxes;
};