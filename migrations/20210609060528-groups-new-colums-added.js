'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('groups', 'group_type', { type: Sequelize.DataTypes.STRING });
    await queryInterface.addColumn('groups', 'members', { type: Sequelize.DataTypes.STRING });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('groups', 'group_type', { type: Sequelize.DataTypes.STRING });
    await queryInterface.removeColumn('groups', 'members', { type: Sequelize.DataTypes.STRING });
  }
};
