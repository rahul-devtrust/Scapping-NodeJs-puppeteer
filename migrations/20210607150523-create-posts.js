'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      post_id: {
        type: Sequelize.STRING
      },
      sender: {
        type: Sequelize.STRING
      },
      group_name: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING
      },
      like: {
        type: Sequelize.STRING
      },
      share: {
        type: Sequelize.STRING
      },
      comment: {
        type: Sequelize.STRING
      },
      group_id: {
        type: Sequelize.STRING
      },
      user_id: {
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
    await queryInterface.dropTable('Posts');
  }
};