const Sequelize = require('sequelize');
const db = require('../util/database');

const Stock = db.define('stocks', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    class: Sequelize.STRING,
    country: Sequelize.STRING,
    type: Sequelize.STRING,
    code: Sequelize.STRING,
    sector: Sequelize.STRING,
    active: Sequelize.STRING,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE
});

module.exports = Stock;
