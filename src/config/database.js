import 'dotenv/config';

module.exports = {
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'mydb',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    }
}