'use strict';
module.exports = (sequelize, DataTypes) => {
  const replay = sequelize.define('replay', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
      allowNull: false
    },
    companyphone: {
      type:DataTypes.STRING,
      allowNull: false
    },
    companyreplay: {
      type:DataTypes.STRING,
      allowNull: false
    },
    questionid: {
      type:DataTypes.STRING,
      allowNull: false
    },
    userphone:{
      type:DataTypes.STRING,
      allowNull: false
    }  
  }, {});
  replay.associate = function(models) {
    // associations can be defined here
    replay.belongsTo(models.inboxes, { foreignKey: 'companyid', targetKey: 'id' });
  };
  return replay;
};