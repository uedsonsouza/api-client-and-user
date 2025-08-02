import jwt from 'jsonwebtoken';
import User from "../models/User";
import authConfig from '../../config/auth';

class SessionController {
    async create(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: "Token not provided" });
        }

        const isPasswordValid = await user.checkPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        const { id, name } = user;
        console.log('to no retorno do Session rapaz --->', authConfig.secret, authConfig.expiresIn,)
        return res.json({
            user: {
                id,
                name,
                email,
            },
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });

        // return res.status(200).json({ sucessul: "Deu bom rapaz" });
    }
}
export default new SessionController();
