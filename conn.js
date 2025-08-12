const express=require("express");
const util=require("util");
const mysql=require("mysql");

const conn= mysql.createConnection({
    host:"b1bw8tc8o7ajthxwigmp-mysql.services.clever-cloud.com",
    user:"uog61hu4nggzwmgo",
    password:"cDI4XHDyXEk3ENytM63g",
    database:"b1bw8tc8o7ajthxwigmp"
})

const exe= util.promisify(conn.query).bind(conn);

module.exports = exe;