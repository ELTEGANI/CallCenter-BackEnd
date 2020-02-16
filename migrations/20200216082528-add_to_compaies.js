'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'companies',
      'isCompanyVisible',
      {
        type: Sequelize.STRING,
        allowNull: false,
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'companies',
      'isCompanyVisible',
    );
  }
};