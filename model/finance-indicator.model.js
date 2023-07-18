const Sequelize = require('sequelize');
const db = require('../util/database');
const Stock = require('./stock.model');

const FinanceIndicator = db.define('finance_indicators', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    closure: Sequelize.DOUBLE,
    averageValue: Sequelize.DOUBLE,
    fullValue: Sequelize.DOUBLE,
    netProfit: Sequelize.DOUBLE,
    ebit: Sequelize.DOUBLE,
    netWorth: Sequelize.DOUBLE,
    depAmor: Sequelize.DOUBLE,
    beta: Sequelize.DOUBLE,
    divPag: Sequelize.DOUBLE,
    ev: Sequelize.DOUBLE,
    divid: Sequelize.DOUBLE,
    extractionDate: Sequelize.DATE,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
    stockId: Sequelize.INTEGER
});

Stock.hasMany(FinanceIndicator);
FinanceIndicator.belongsTo(Stock);



module.exports = FinanceIndicator;
