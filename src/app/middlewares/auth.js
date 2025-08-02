import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

export default async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    const [, parts] = authHeader.split(' ');

    try {
        const decoded =  await jwt.verify(parts, authConfig.secret);
        req.userId = decoded.id;

        return next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ error: 'Token invalid' });
    }
}