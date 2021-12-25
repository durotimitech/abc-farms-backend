const pool = require("./connect");

class Queries {
  // INSERT
  async insertOne({ table, data }) {
    try {
      let sql = `INSERT INTO ${table} SET ?`;

      const res = await new Promise((resolve, reject) => {
        pool.query(sql, data, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });
      return res;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  // SELECT
  async selectAll({ table }) {
    try {
      let sql = `SELECT * FROM ${table}`;
      const res = await new Promise((resolve, reject) => {
        pool.query(sql, (err, result) => {
          if (err) return err;
          resolve(result);
        });
      });

      return res;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async selectAllAndOrder({ table, orderBy, direction }) {
    try {
      let sql = `SELECT * FROM ${table} ORDER BY ${orderBy} ${direction}`;

      const res = await new Promise((resolve, reject) => {
        pool.query(sql, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });
      return res;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  // SELECT ALL WITH CONDITION
  async selectAllWith1Condition({ table, condition }) {
    try {
      let sql = `SELECT * FROM ${table} WHERE ?`;

      const res = await new Promise((resolve, reject) => {
        pool.query(sql, [condition], (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });
      return res;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async selectAllWith2Conditions({ table, condition1, condition2 }) {
    try {
      let sql = `SELECT * FROM ${table} WHERE ? AND ?`;

      const res = await new Promise((resolve, reject) => {
        pool.query(sql, [condition1, condition2], (err, result) => {
          if (err) return err;
          resolve(result);
        });
      });
      return res;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async selectColumnsWith1Operator({ table, columns, condition }) {
    try {
      let sql = `SELECT ${columns} FROM ${table} WHERE ${condition}`;

      const res = await new Promise((resolve, reject) => {
        pool.query(sql, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });
      return res;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  //  SELECT ALL FROM JOIN
  async selectAllFromJoin2AndOrder({
    table1,
    table2,
    joint1,
    orderBy,
    direction,
  }) {
    try {
      let sql = `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} ORDER BY ${orderBy} ${direction}`;

      const res = await new Promise((resolve, reject) => {
        pool.query(sql, (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });
      return res;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async selectAllFromJoin2With1condition({
    table1,
    table2,
    joint1,
    condition,
  }) {
    try {
      let sql = `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} WHERE ?`;

      const res = await new Promise((resolve, reject) => {
        pool.query(sql, [condition], (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });
      return res;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async selectAllFromJoin2With1conditionAndOrder({
    table1,
    table2,
    joint1,
    condition,
    orderBy,
    direction,
  }) {
    try {
      let sql = `SELECT * FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} WHERE ?  ORDER BY ${orderBy} ${direction}`;

      const res = await new Promise((resolve, reject) => {
        pool.query(sql, [condition], (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });
      return res;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  // SLECT WITH COLUMNS
  async selectColumnsFromJoin3With1condition({
    table1,
    table2,
    table3,
    joint1,
    joint2,
    columns,
    condition,
  }) {
    try {
      let sql = `SELECT ${columns} FROM ${table1} JOIN ${table2} ON ${table1}.${joint1} = ${table2}.${joint1} JOIN ${table3} ON ${table1}.${joint2} = ${table3}.${joint2} WHERE ?`;

      const res = await new Promise((resolve, reject) => {
        pool.query(sql, [condition], (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });
      return res;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  // UPDATE
  async updateOne({ table, data, condition }) {
    try {
      let sql = `UPDATE ${table} SET ? WHERE ?`;

      const res = await new Promise((resolve, reject) => {
        pool.query(sql, [data, condition], (err, result) => {
          if (err) reject(err);
          resolve(result);
        });
      });

      return res;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}

module.exports = new Queries();
