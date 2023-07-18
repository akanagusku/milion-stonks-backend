const express = require("express");
const Stock = require("./model/stock.model");
const FinanceIndicator = require("./model/finance-indicator.model");
const sequelize = require("./util/database");
var bodyParser = require("body-parser");
const { Op, QueryError } = require("sequelize");
const fs = require("fs");
const { parse } = require("csv-parse");

const app = express();
app.use(bodyParser.json());

const port = 3000;

app.post("/api/stocks", (req, res) => {
  queryConditionMapper = {
    and: Op.and,
    or: Op.or,
  };

  queryOperatorMapper = {
    "=": Op.eq,
    "!=": Op.ne,
    like: Op.like,
    contains: Op.contains,
    ">": Op.gt,
    ">=": Op.gte,
    "<": Op.lt,
    "<=": Op.lte,
  };

  var query;
  if (req.body.query) {
    query = {
      where: {},
    };
    query.where[queryConditionMapper[req.body.query.condition]] =
      req.body.query.rules.map((rule) => {
        var obj = {};
        obj[[rule.field]] = {};
        Object.defineProperty(
          obj[rule.field],
          queryOperatorMapper[rule.operator],
          { enumerable: true, writable: true, value: rule.value }
        );

        return obj;
      });
  }

  return Stock.findAll(query)
    .then((stocks) => {
      return res.status(200).json(stocks);
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
      return res;
    });
});

app.get("/api/start-db", async (req, res) => {
  let stock = {};
  let financeIndicator = {};
  let stocks = [];

  fs.createReadStream("./bd_principal.csv")
    .pipe(parse({ delimiter: ";", from_line: 2 }))
    .on("data", (row) => {
      stocks.push(row);
    })
    .on("end", async () => {
      for (let i = 0; i < stocks.length; i++) {
        [stock] = await Stock.findOrCreate({
          where: { code: stocks[i][5] },
          defaults: {
            name: stocks[i][3],
            class: stocks[i][4],
            code: stocks[i][5],
            country: stocks[i][6],
            sector: stocks[i][7],
          },
        });

        await FinanceIndicator.create(
          {
            closure: normalizeFloat(stocks[i][8]),
            averageValue: normalizeFloat(stocks[i][9]),
            fullValue: normalizeFloat(stocks[i][10]),
            netProfit: normalizeFloat(stocks[i][11]),
            ebit: normalizeFloat(stocks[i][12]),
            netWorth: normalizeFloat(stocks[i][13]),
            depAmor: normalizeFloat(stocks[i][14]),
            beta: normalizeFloat(stocks[i][15]),
            divPag: normalizeFloat(stocks[i][16]),
            ev: normalizeFloat(stocks[i][17]),
            divid: normalizeFloat(stocks[i][18]),
            extractionDate: new Date(stocks[i][2], stocks[i][1], stocks[i][0]),
            createdAt: new Date(),
            stockId: parseInt(stock.id),
          },
          {
            include: [Stock],
          }
        );
      }
    });
});

function normalizeFloat(value) {
  if (value == '-') {
    return null;
  }
  return (value) ? parseFloat(value.replace(',','.')) : 0;
}

sequelize
  .sync()
  .then((result) => {
    console.log("Database connected");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => console.log(err));
