const express = require('express');
var bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
var dbo;
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/RoadsideAssistance';
MongoClient.connect(url, function(err, db) {
  dbo = db.db('RoadsideAssistance');
  if (err) throw err;
  console.log('connected');

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

app.listen(5002);
