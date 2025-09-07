"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const tableInfo = await queryInterface.describeTable("users");
        if (!tableInfo.file_id) {
            await queryInterface.addColumn("users", "file_id", {
                type: Sequelize.INTEGER,
                references: {
                    model: "files",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            });
        }
    },

    async down(queryInterface) {
        const tableInfo = await queryInterface.describeTable("users");
        if (tableInfo.file_id) {
            await queryInterface.removeColumn("users", "file_id");
        }
    },
};
