"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const tableInfo = await queryInterface.describeTable("customers");
        if (!tableInfo.status) {
            await queryInterface.addColumn("customers", "status", {
                type: Sequelize.ENUM("ACTIVE", "ARCHIVED"),
                defaultValue: "ACTIVE",
                allowNull: false,
            });
        }
    },

    async down(queryInterface) {
        return queryInterface.sequelize.transaction(
            async (transaction) => {
                const tableInfo = await queryInterface.describeTable("customers");
                if (tableInfo.status) {
                    await queryInterface.removeColumn("customers", "status", { transaction });
                }
                await queryInterface.sequelize.query(
                    'DROP TYPE IF EXISTS "enum_customers_status";', { transaction }
                );
            },
        );
    },
};
