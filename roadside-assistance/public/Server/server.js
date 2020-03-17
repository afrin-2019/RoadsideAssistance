const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
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
      .find({ Status: { $ne: "closed" } })
      .toArray(function(err, result) {
        if (err) throw err;

        res.send(result);
      });
  });
  app.get("/get/ticketinfo/unassigned", (req, res) => {
    dbo
      .collection("TicketInfoWebPortal")
      .find({ Status: "unassigned" })
      .toArray(function(err, result) {
        if (err) throw err;

        res.send(result);
      });
  });
  app.get("/get/ticketinfo/assigned", (req, res) => {
    dbo
      .collection("TicketInfoWebPortal")
      .find({ Status: "assigned" })
      .toArray(function(err, result) {
        if (err) throw err;

        res.send(result);
      });
  });
  app.get("/get/ticketinfo/ongoing", (req, res) => {
    dbo
      .collection("TicketInfoWebPortal")
      .find({ Status: "ongoing" })
      .toArray(function(err, result) {
        if (err) throw err;

        res.send(result);
      });
  });
  //get the detail of engineers
  app.get("/get/engineerdetails", (req, res) => {
    dbo
      .collection("EngineerDetails")
      .find({})
      .toArray(function(err, result) {
        if (err) throw err;

        res.send(result);
      });
  });

  //get the detail of customers
  app.get("/get/customerdetails", (req, res) => {
    dbo
      .collection("CustomerDetails")
      .find({})
      .toArray(function(err, result) {
        if (err) throw err;

        res.send(result);
      });
  });

  //get the engineer detail based on ticket no
  app.get("/get/engineerdetail/ticket_no_based", (req, res) => {
    var request = req.query.TicketNo;
    dbo
      .collection("EngineerDetails")
      .find({ Ticket_No: request })
      .toArray(function(err, result) {
        if (err) throw err;
        if (result.length == 0) {
          res.send("no such record");
        } else {
          res.send(result);
        }
      });
  });
  //get the detail of closed tickets
  app.get("/get/ticketinfo/closed", (req, res) => {
    dbo
      .collection("TicketInfoWebPortal")
      .find({ Status: "closed" })
      .toArray(function(err, result) {
        if (err) throw err;

        res.send(result);
      });
  });

  //update the assigned engineer name, his status and updated time
  app.put("/update/ticketinfo", (req, res) => {
    var request = req.body.data;
    console.log("request", request);
    dbo.collection("TicketInfoWebPortal").updateMany(
      { Ticket_No: request.TicketNo },
      {
        $set: {
          Engineer_Assigned: request.EngineerAssigned,
          Status: "assigned",
          Time: new Date().toLocaleString()
        }
      }
    );
    res.send("updated");
  });

  //update the engineer table after manual assignment of engineers
  app.put("/update/engineerdetail", (req, res) => {
    var request = req.body.data;
    console.log("req", request);
    console.log("request", request);
    dbo.collection("EngineerDetails").updateMany(
      { Name: request.EngineerAssigned },
      {
        $push: {
          Ticket_No: request.TicketNo
        }
      }
    );
    res.send("engineer details updated");
  });
  //get the customer detail based on ticket no
  app.get("/get/customerdetail/ticket_no_based", (req, res) => {
    var request = req.query.TicketNo;
    dbo
      .collection("TicketInfoWebPortal")
      .find({ Ticket_No: request })
      .toArray(function(err, result) {
        if (err) throw err;
        if (result.length == 0) {
          res.send("no such record");
        } else {
          res.send(result);
        }
      });
  });
});
app.listen(5002, () => console.log("server running on port 5002"));
