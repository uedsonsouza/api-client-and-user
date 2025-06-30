import Customer from "../models/Customer";
import Contacts from "../models/Contacts";
import Op from "sequelize";
import * as Yup from "yup";

class CustomersController {
    async index(req, res) {
        const {
            name,
            email,
            status,
            createdBefore,
            createdAfter,
            updatedBefore,
            updatedAfter,
            sort,
        } = req.query;

        const page = req.query.page || 1;
        const limit = req.query.limit || 25;

        let where = {};
        let order = [];

        if (name) {
            where = {
                ...where,
                name: {
                    [Op.iLike]: `%${name}%`,
                },
            };
        }

        if (email) {
            where = {
                ...where,
                email: {
                    [Op.iLike]: email,
                },
            };
        }

        if (status) {
            where = {
                ...where,
                status: {
                    [Op.in]: status
                        .split("", "")
                        .map((item) => item.toUpperCase()),
                },
            };
        }

        if (createdBefore) {
            where = {
                ...where,
                createdAt: {
                    [Op.lt]: new Date(createdBefore),
                },
            };
        }

        if (createdAfter) {
            where = {
                ...where,
                createdAt: {
                    [Op.gt]: new Date(createdAfter),
                },
            };
        }
        if (updatedBefore) {
            where = {
                ...where,
                updatedAt: {
                    [Op.lt]: new Date(updatedBefore),
                },
            };
        }
        if (updatedAfter) {
            where = {
                ...where,
                updatedAt: {
                    [Op.gt]: new Date(updatedAfter),
                },
            };
        }
        if (sort) {
            order = sort.split(",").map((item) => {
                item.split(":");
            });
        }
        const data = await Customer.findAll({
            limit,
            include: [{ model: Contacts, attributes: ["id", "status"] }],
            order,
            where,
            offset: limit * page - limit,
        });
        return res.status(200).json(data);
    }

    async show(req, res) {
        const customer = await Customer.findByPk(req.params.id);

        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        return res.status(200).json(customer);
    }

    async create(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            status: Yup.string().uppercase(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Invalid customer data" });
        }

        if (!schema) {
            return res.status(500).json({ error: "Error creating customer" });
        }

        const customer = await Customer.create(req.body);

        return res.status(201).json(customer);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            status: Yup.string().uppercase(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Invalid customer data" });
        }

        if (!schema) {
            return res.status(500).json({ error: "Error creating customer" });
        }

        const customer = await Customer.findByPk(req.params.id);
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        await customer.update(req.body);
        return res.status(200).json(customer);
    }

    async destroy(req, res) {
        const customer = await Customer.findByPk(req.params.id);

        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        await customer.destroy();
        return res.json();
    }
}

export default new CustomersController();
