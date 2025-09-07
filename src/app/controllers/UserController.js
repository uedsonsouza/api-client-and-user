import { Op } from "sequelize";
import * as Yup from "yup";
// import { parseISO } from "date-fns";
import WelcomeEmailJob from "../jobs/WelcomeEmailJob.js";
import Queue from "../../lib/Queue.js";
import User from "../models/User.js";

class UserController {
    async index(req, res) {
        const {
            name,
            email,
            password_hash,
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

        if (password_hash) {
            where = {
                ...where,
                password_hash: {
                    [Op.iLike]: password_hash,
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
        const data = await User.findAll({
            attributes: { exclude: ["password_hash"] },
            limit,
            order,
            where,
            offset: limit * page - limit,
        });
        return res.status(200).json(data);
    }

    async show(req, res) {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ["password", "password_hash"] },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const { id, name, email, createdAt, updatedAt } = user;

        return res.status(200).json({ id, name, email, createdAt, updatedAt });
    }

    async create(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
            passwordConfirmation: Yup.string().when(
                "password",
                (password, field) =>
                    password
                        ? field.required().oneOf([Yup.ref("password")])
                        : field,
            ),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Invalid user data" });
        }

        if (!schema) {
            return res.status(500).json({ error: "Error creating user" });
        }

        const { id, name, email, file_id, createdAt, updatedAt } =
            await User.create(req.body);

        
        await Queue.add(WelcomeEmailJob.key, {
            email,
            name
        });

        return res
            .status(201)
            .json({ id, name, email, file_id, createdAt, updatedAt });
    }
    //Validar autenticacao que nao está funcionando corretamente
    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(8),
            password: Yup.string()
                .min(8)
                .when("oldPassword", (oldPassword, field) =>
                    oldPassword ? field.required() : field,
                ),
            passwordConfirmation: Yup.string().when(
                "password",
                (password, field) =>
                    password
                        ? field.required().oneOf([Yup.ref("password")])
                        : field,
            ),
        });

        if (!(await schema.isValid(req.body))) {
            console.log("schema update --->", schema);
            console.log("req.body update --->", req.body);
            console.log("req.params.id update --->", req.params.id);
            return res.status(400).json({ error: "Invalid user data" });
        }

        if (!schema) {
            return res.status(500).json({ error: "Error creating user" });
        }

        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const { oldPassword } = req.body;
        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res
                .status(401)
                .json({ error: "Old password does not match" });
        }

        const { id, name, email, file_id, createdAt, updatedAt } =
            await user.update(req.body);

        return res
            .status(201)
            .json({ id, name, email, file_id, createdAt, updatedAt });
    }

    async destroy(req, res) {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await user.destroy();
        return res.json();
    }
}

export default new UserController();
