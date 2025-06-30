import { Sequelize } from "sequelize";
import config from "../config/database.js";
import User from "../app/models/User.js";
import Customer from "../app/models/Customer.js";
import Contacts from "../app/models/Contacts.js"

const models = [User, Customer, Contacts];
class Database {

    constructor() {
        this.connection = new Sequelize(config);
    }
    init() {
        models.forEach(model => {
            model.init(this.connection);
        });
    }

    associate() {
        models.forEach(model => {
            if (model.associate) {
                model.associate(this.connection.models);
            }
        });
    }

}

const database = new Database();
database.init();
database.associate();

export default Database;