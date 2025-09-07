'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('users');
    if (!tableInfo.provider) {
      await queryInterface.addColumn('users', 'provider', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      });
    }
    if (!tableInfo.created_at) {
      await queryInterface.addColumn('users', 'created_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      });
    }

    if (!tableInfo.updated_at) {
      await queryInterface.addColumn('users', 'updated_at', {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.fn('NOW')
      });
    }
  },

  async down (queryInterface) {
    const tableInfo = await queryInterface.describeTable('users');
    if (tableInfo.provider) {
      await queryInterface.removeColumn('users', 'provider');
    }
    if (tableInfo.created_at) {
      await queryInterface.removeColumn('users', 'created_at');
    }
    if (tableInfo.updated_at) {
      await queryInterface.removeColumn('users', 'updated_at');
    }
  }
};
