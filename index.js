const express = require("express");
const Stock = require("./model/stock.model");
const sequelize = require("./util/database");
var bodyParser = require("body-parser");
const { Op, QueryError } = require("sequelize");

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

sequelize
  .sync()
  .then((result) => {
    console.log("Database connected");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch((err) => console.log(err));
