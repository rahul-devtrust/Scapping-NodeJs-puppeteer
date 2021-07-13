'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('y_trendings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      v_title: {
        type: Sequelize.STRING
      },
      v_channel_name: {
        type: Sequelize.STRING
      },
      v_channel_views: {
        type: Sequelize.STRING
      },
      v_channel_date: {
        type: Sequelize.STRING
      },
      v_description: {
        type: Sequelize.TEXT
      },
      v_img: {
        type: Sequelize.TEXT
      },
      v_channel_video_url: {
        type: Sequelize.STRING
      },
      v_duration: {
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
    await queryInterface.dropTable('y_trendings');
  }
};