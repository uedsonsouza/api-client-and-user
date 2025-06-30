import Sequelize, { Model }  from "sequelize";

class Contacts extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                status: Sequelize.ENUM("ACTIVE", "ARCHIVED"),
            },
            {
                sequelize,
                name: {
                    singular: "contact",
                    plural: "contacts",
                },
                tableName: "contacts",
            }
        );
    }
    static associate(models) {
        this.belongsTo(models.Customer, { foreignKey: "customer_id", as: "customer" });
    }
}

export default Contacts;