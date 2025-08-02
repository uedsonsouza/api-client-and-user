'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'name', {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100],
        },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'name', {
        type: Sequelize.STRING,
        allowNull: true,
    });
  }
};
