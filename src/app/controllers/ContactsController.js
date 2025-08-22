import { logger } from "@sentry/node";
import Contacts from "../models/Contacts";
import Customer from "../models/Customer";
import { Op } from "sequelize";
import * as Yup from "yup";

class ContactsController {
    async index(req, res) {
        try {
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

        let where = { customer_id: req.params.customer_id };
        let order = [];

        console.log("req.params.customer_id ====>", req.params.customer_id);
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
        const data = await Contacts.findAll({
            limit,
            include: [
                {
                    model: Customer,
                    as: "customer",
                    attributes: ["id", "status"],
                    required: true,
                },
            ],
            order,
            where,
            offset: limit * page - limit,
        });
        return res.status(200).json(data);
        } catch (err) {
            logger.info("error or search for registered users", err)
            return res.status(500).json({ error: "Error search contacts" });
        }
    }

    async show(req, res) {
        const contact = await Contacts.findOne({
            where: { id: req.params.id, customer_id: req.params.customer_id },
            attributes: { exclude: ["customer_id", "customerId"] },
        });

        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }
        return res.status(200).json(contact);
    }

    async create(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            status: Yup.string().uppercase(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Invalid contact data" });
        }

        try {
            const contact = await Contacts.create({
                customer_id: req.params.customer_id,
                ...req.body,
            });
            return res.status(201).json(contact);
        } catch (err) {
            logger.error('erro na criacao do contato', err)
            return res.status(500).json({ error: "Error creating contact" });
        }
    }

    async update(req, res) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string(),
                email: Yup.string().email(),
                status: Yup.string().uppercase(),
            });

            if (!(await schema.isValid(req.body))) {
                return res.status(400).json({ error: "Invalid contact data" });
            }

            const contact = await Contacts.findOne({
                where: { id: req.params.id, customer_id: req.params.customer_id },
                attributes: { exclude: ["customer_id", "customerId"] },
            });
            if (!contact) {
                return res.status(404).json({ error: "Contact not found" });
            }

            await contact.update(req.body);
            return res.status(200).json(contact);
        } catch (err) {
            logger.error('Erro na atualização do contato', err)
            return res.status(500).json({ error: "Error updating contact" });
        }
    }

    async destroy(req, res) {
        const contact = await Contacts.findOne({
            where: { id: req.params.id, customer_id: req.params.customer_id },
        });

        if (!contact) {
            return res.status(404).json({ error: "Contact not found" });
        }

        await contact.destroy();
        return res.json();
    }
}

export default new ContactsController();
