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
      password: {
        type:Sequelize.STRING,
        allowNull: false,
      },
      bussinessType:{
        type:Sequelize.STRING,
        allowNull: false,
      },
      ownerPhone:{
        type:Sequelize.STRING,
      allowNull: false,
      },
      ownerName:{
        type:Sequelize.STRING,
        allowNull: false,
        },
      ownerEmail:{
        type:Sequelize.STRING,
          allowNull: false,
          },
      isCompanyVisible:{
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