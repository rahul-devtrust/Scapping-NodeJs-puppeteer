'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('insta_userposts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      post_id: {
        type: Sequelize.STRING
      },
      post_content_img: {
        type: Sequelize.TEXT
      },
      post_like: {
        type: Sequelize.STRING
      },
      post_view: {
        type: Sequelize.STRING
      },
      post_content_video: {
        type: Sequelize.TEXT
      },
      post_caption: {
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
    await queryInterface.dropTable('insta_userposts');
  }
};