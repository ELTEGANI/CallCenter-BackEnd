'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('inboxes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        allowNull: false,
      },
      companyid: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      incomingmessages: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      senderohone: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      status: {
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
    return queryInterface.dropTable('inboxes');
  }
};