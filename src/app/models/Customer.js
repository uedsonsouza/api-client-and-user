import Sequelize, { Model } from "sequelize";

class Customer extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                status: Sequelize.ENUM("ACTIVE", "ARCHIVED"),
            },
            {
                scopes: {
                    active: {
                        where: {
                            status: "ACTIVE",
                        },
                        order: ["createdAt"],
                    },
                },
                hooks: {
                    beforeCreate: (customer) => {
                        customer.status = "ACTIVE";
                    },
                },
                sequelize,
                name: {
                    singular: "customer",
                    plural: "customers",
                },
                tableName: "abobrinha",
            },
        );
    }
    static associate(models) {
        this.hasMany(models.Contacts);
    }
}

export default Customer;
