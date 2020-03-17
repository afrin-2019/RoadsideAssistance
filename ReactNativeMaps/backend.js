const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

io.on('connection', socket => {
  console.log('user connected');
});
var dbo;
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/RoadsideAssistance';
MongoClient.connect(url, function(err, db) {
  dbo = db.db('RoadsideAssistance');
  if (err) throw err;
  console.log('connected');

  app.post('/post/ticketdetails', (req, res) => {
    var request = req.body.data;
    var status = {Status: 'Pending'};
    var updated_request = Object.assign({}, request, status);
    dbo
      .collection('RaisedTickets')
      .insertOne(updated_request, function(err, res) {
        if (err) throw err;
      });
    res.send({Message: 'Inserted successfully'});
  });
  //Get the Status of the ticket
  app.get('/get/ticketdetails/processing', (req, res) => {
    dbo
      .collection('RaisedTickets')
      .find({Status: 'Processing'})
      .toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
      });
  });
  app.get('/get/ticketdetails/closed', (req, res) => {
    dbo
      .collection('RaisedTickets')
      .find({Status: 'Closed'})
      .toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
      });
  });

  //Get raised ticket details from the database
  app.get('/get/ticketdetails', (req, res) => {
    dbo
      .collection('RaisedTickets')
      .find({Status: 'Pending'})
      .toArray(function(err, result) {
        if (err) throw err;
        res.send(result);
      });
  });

  //Update the status from "Pending" to "Processing"
  app.put('/update/status', (req, res) => {
    var request = req.body.data;
    dbo
      .collection('RaisedTickets')
      .updateOne({Status: request.from}, {$set: {Status: request.to}});
    res.send('Updated Successfully');
  });
});
//app.listen(5001);
server.listen(5001, () => console.log('server running on port 5001'));
