'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('menus', {
      id: {
        type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true,
      allowNull: false,
      },
      questions: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      answers: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      questionorder: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      companyid: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('menus');
  }
};