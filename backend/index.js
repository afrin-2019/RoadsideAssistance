const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
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
  io.on("connection", socket => {
    console.log("user connected");
    //socket.on("AcceptbyMechanic", msg => socket.emit("MechanicAccepted", msg));

    app.post("/post/ticketdetails", (req, res) => {
      var request = req.body.data;
      dbo
        .collection("TicketInfoWebPortal")
        .countDocuments()
        .then(response => {
          var stringTicket = response + 1 + "T";
          var ticketNo = {
            Ticket_No: stringTicket
          };
          var status = { Status: "Pending" };
          var updated_request = Object.assign({}, request, ticketNo, status);
          dbo
            .collection("RaisedTickets")
            .insertOne(updated_request, function(err, res) {
              if (err) throw err;
            });
          res.send({ Message: "Inserted successfully" });
          var message = "TicketRaised";
          socket.broadcast.emit("TicketRaisedbyUser", updated_request);
        });
    });

    //inserting otp details in db

    app.post("/post/otpdetails", (req, res) => {
      var request = req.body.data;

      dbo.collection("StoreOTP").insertOne(request, function(err, res) {
        if (err) throw err;
      });
      res.send({ message: "OTP Inserted successfully" });
      var message = "ValidOTP";
      socket.broadcast.emit("validOTP", message);
    });

    //Get the Status of the ticket
    app.get("/get/ticketdetails/processing", (req, res) => {
      dbo
        .collection("RaisedTickets")
        .find({ Status: "Processing" })
        .toArray(function(err, result) {
          if (err) throw err;
          res.send(result);
        });
    });
    app.get("/get/ticketdetails/closed", (req, res) => {
      dbo
        .collection("RaisedTickets")
        .find({ Status: "Closed" })
        .toArray(function(err, result) {
          if (err) throw err;
          res.send(result);
        });
    });
    //Get mechanic details from the database
    app.get("/get/mechanicdetails", (req, res) => {
      dbo
        .collection("MechanicDetails")
        .find({ flag: "free" })
        .toArray(function(err, result) {
          if (err) throw err;
          res.send(result);
        });
    });

    //Get raised ticket details from the database
    app.get("/get/ticketdetails", (req, res) => {
      dbo
        .collection("RaisedTickets")
        .find({ Status: "Pending" })
        .toArray(function(err, result) {
          if (err) throw err;
          res.send(result);
        });
    });

    //Get raised ticket details from the database based on ticket_no
    app.get("/get/ticketdetails/ticket_no_based", (req, res) => {
      var request = req.query.TicketNo;
      dbo
        .collection("RaisedTickets")
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

    //Update the status from "Pending" to "Processing"
    app.put("/update/status", (req, res) => {
      var request = req.body.data;
      dbo
        .collection("RaisedTickets")
        .updateOne({ Status: request.from }, { $set: { Status: request.to } });
      res.send("Updated Successfully");

      var message = request.to;
      socket.broadcast.emit("AcceptbyMechanic", request);
    });

    //get ticket details of tatasky ticket
    app.get("/get/ticketdetails/engineer", (req, res) => {
      dbo
        .collection("EngineerTicketDetails")
        .find({})
        .toArray(function(err, result) {
          if (err) throw err;
          console.log("eng tic det", result);
          res.send(result);
        });
    });
    //inser ticket details into EngineerTicketDetail collection
    app.post("/post/engineerticketdetails", (req, res) => {
      var request = req.body;

      // console.log("time is", { $hour: new Date(date) });
      var time = { Time: Date() };
      var status = { Status: "pending" };
      var updated_request = Object.assign({}, request, time, status);
      dbo
        .collection("EngineerTicketDetails")
        .insertOne(updated_request, function(err, res) {
          if (err) throw err;
        });
      res.send({ Message: "Inserted successfully in EngineerTicketDetails" });
      var message = "TicketRaised";
      socket.broadcast.emit("TicketRaisedtoEngineer", updated_request);
    });

    //update the status to closed
    app.put("/update/engineerticketdetails/status", (req, res) => {
      var request = req.body.data;
      var status = "closed";
      console.log(request);
      dbo
        .collection("EngineerTicketDetails")
        .updateOne({ Customer_id: request.id }, { $set: { Status: status } });
      res.send("Status closed");
    });

    // //generate ticket no
    // app.get("/get/generateticketno", (req, res) => {
    //   dbo
    //     .collection("TicketInfoWebPortal")
    //     .countDocuments()
    //     .then(response => {
    //       res.send(response);
    //     });
    // });

    //post ticket details in TicketInfoWebPortal once raised by user

    app.post("/post/ticketinfo/webportal", (req, res) => {
      var request = req.body.data;
      dbo
        .collection("TicketInfoWebPortal")
        .countDocuments()
        .then(response => {
          var stringTicket = response + 1 + "T";
          var ticketNo = {
            Ticket_No: stringTicket
          };
          var engineerAssigned = { Engineer_Assigned: "-" };
          var status = { Status: "unassigned" };
          var time = { Time: new Date().toLocaleString() };
          var raisedtime = { Raised_Time: new Date().toLocaleString() };
          var updated_request = Object.assign(
            {},
            request,
            ticketNo,
            engineerAssigned,
            status,
            time,
            raisedtime
          );
          dbo
            .collection("TicketInfoWebPortal")
            .insertOne(updated_request, function(err, res) {
              if (err) throw err;
            });
          res.send({ Message: "Inserted successfully in TicketInfoWebPortal" });
        });
    });

    //get Customer Details from db

    app.get("/get/customerdetails", (req, res) => {
      dbo
        .collection("CustomerDetails")
        .find({})
        .toArray(function(err, result) {
          if (err) throw err;

          res.send(result);
        });
    });

    // -------------------------------------------------------
    //            from react app
    //--------------------------------------------------------

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
            Time: new Date().toLocaleString(),
            Type_of_Assignment: "Manual",
            Assigned_Time: new Date().toLocaleString()
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

    //delete the token info from the engineer table after the ticket is closed

    app.put("/update/engineerdetail/afterclosed", (req, res) => {
      var request = req.body.data;
      console.log("req", request);
      console.log("request", request);
      dbo.collection("EngineerDetails").updateMany(
        { Name: request.EngineerAssigned },
        {
          $pull: {
            Ticket_No: request.TicketNo
          }
        }
      );
      res.send("engineer details updated after ticket is closed");
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

    //update ticket info webportal to assigned,time of assignment and engineer assigned
    app.put("/update/webportal/assigned", (req, res) => {
      var request = req.body.data;
      dbo.collection("TicketInfoWebPortal").updateMany(
        {
          Ticket_No: request.TicketNo
        },
        {
          $set: {
            Status: "assigned",
            Time: new Date().toLocaleString(),
            Assigned_Time: new Date().toLocaleString(),
            Engineer_Assigned: request.EngineerAssigned,
            Type_of_Assignment: request.AssignmentType
          }
        }
      );
      res.send("Ticket assigned by engineer is updated");
      var message = "TicketAcceptedbyEngineer";
      socket.broadcast.emit("Assigned", request);
    });

    //update ticket info webportal to ongoing,time
    app.put("/update/webportal/ongoing", (req, res) => {
      var request = req.body.data;
      dbo.collection("TicketInfoWebPortal").updateMany(
        {
          Ticket_No: request.ticketNo
        },
        {
          $set: {
            Status: "ongoing",
            Time: new Date().toLocaleString(),
            Work_Started: new Date().toLocaleString()
          }
        }
      );
      res.send("Work started by engineer is updated");
      var message = "WorkStartedbyEngineer";
      socket.broadcast.emit("WorkStarted", message);
    });
    //update ticket info webportal to ongoing,time
    app.put("/update/webportal/closed", (req, res) => {
      var request = req.body.data;
      dbo.collection("TicketInfoWebPortal").updateMany(
        {
          Ticket_No: request.ticketNo
        },
        {
          $set: {
            Status: "closed",
            Time: new Date().toLocaleString()
          }
        }
      );
      res.send("Work closed by engineer is updated");
      var message = "WorkClosedbyEngineer";
      socket.broadcast.emit("Closed", message);
    });
  });
});
//app.listen(5001);
server.listen(5001, () => console.log("server running on port 5001"));
