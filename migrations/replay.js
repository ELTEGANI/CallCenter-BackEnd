'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('replays', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        allowNull: false,
      },
      companyphone: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      companyreplay: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      questionid: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      userphone: {
        type:Sequelize.STRING,
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
    return queryInterface.dropTable('replays');
  }
};