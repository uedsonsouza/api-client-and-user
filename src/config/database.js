module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    username: 'user',
    password: 'password',
    database: 'mydb',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    }
}