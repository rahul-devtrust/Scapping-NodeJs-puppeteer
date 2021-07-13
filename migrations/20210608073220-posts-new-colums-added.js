'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.addColumn('posts', 'search_type', { type: Sequelize.DataTypes.STRING });
     await queryInterface.addColumn('posts', 'search_text', { type: Sequelize.DataTypes.STRING });
     await queryInterface.addColumn('posts', 'post_date', { type: Sequelize.DataTypes.DATE });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('posts', 'search_type', { type: Sequelize.DataTypes.STRING });
    await queryInterface.removeColumn('posts', 'search_text', { type: Sequelize.DataTypes.STRING });
    await queryInterface.removeColumn('posts', 'post_date', { type: Sequelize.DataTypes.DATE });
  }
};
