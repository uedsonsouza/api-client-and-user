"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("contacts", "status", {
            type: Sequelize.ENUM("ACTIVE", "ARCHIVED"),
            defaultValue: "ACTIVE",
            allowNull: false,
        });
    },

    async down(queryInterface) {
        return queryInterface.sequelize.transaction(
            async (transaction) => {
                await queryInterface.sequelize.query(
                    'DROP TYPE IF EXISTS "enum_contacts_status";', {transaction}
                );
                await queryInterface.removeColumn("contacts", "status", {transaction});
            },
        );
    },
};
