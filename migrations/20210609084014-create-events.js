'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      event_name: {
        type: Sequelize.STRING
      },
      event_link: {
        type: Sequelize.STRING
      },
      event_id: {
        type: Sequelize.STRING
      },
      event_description: {
        type: Sequelize.STRING
      },
      event_type: {
        type: Sequelize.STRING
      },
      people_went: {
        type: Sequelize.STRING
      },
      people_intrested: {
        type: Sequelize.STRING
      },
      event_date: {
        type: Sequelize.DATE
      },
      custom_date: {
        type: Sequelize.STRING
      },
      img: {
        type: Sequelize.STRING
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Events');
  }
};