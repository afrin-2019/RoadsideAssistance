const express = require("express");
var bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var dbo;
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/RoadsideAssistance";
MongoClient.connect(url, function(err, db) {
  dbo = db.db("RoadsideAssistance");
  if (err) throw err;
  console.log("connected");
  app.get("/get/ticketinfo", (req, res) => {
    dbo
      .collection("TicketInfoWebPortal")
      .find({})
      .toArray(function(err, result) {
        if (err) throw err;
        console.log("ticket info", result);
        res.send(result);
      });
  });
});
app.listen(5001);
