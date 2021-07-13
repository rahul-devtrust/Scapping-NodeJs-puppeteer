'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('posts', 'fb_id', { type: Sequelize.DataTypes.STRING });
 },

 down: async (queryInterface, Sequelize) => {
   await queryInterface.removeColumn('posts', 'fb_id', { type: Sequelize.DataTypes.STRING });
 }
};
