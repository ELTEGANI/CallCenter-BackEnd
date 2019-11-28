'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('companies', {
      id: {
        type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true,
      allowNull: false,
      },
      companyPhone: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      companyName: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      numberType: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      simType: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      ownerPhone: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type:Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type:Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('companies');
  }
};