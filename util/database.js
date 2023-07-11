const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'milionstonks',
    'postgres',
    'password',
    {
        host: 'localhost',
        dialect: 'postgres',
    }
);

module.exports = sequelize;
