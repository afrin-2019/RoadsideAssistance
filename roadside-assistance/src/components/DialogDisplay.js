import React, { Component } from "react";
import GoogleMap from "./Maps";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import axios from "axios";
class DialogDisplay extends Component {
  state = {
    visible: true,
    ticketDetail: []
  };

  componentDidMount() {
    console.log("in dialogdisplay", this.props.ticketNo);
    axios
      .get("http://192.168.0.102:5001/get/customerdetail/ticket_no_based", {
        params: {
          TicketNo: this.props.ticketNo
        }
      })
      .then(response => {
        this.setState({ ticketDetail: response.data }, () =>
          console.log("ticket detail", this.state.ticketDetail)
        );
      });
    axios
      .get("http://192.168.0.102:5001/get/engineerdetail/ticket_no_based", {
        params: {
          TicketNo: this.props.ticketNo
        }
      })
      .then(response => {
        console.log(response.data);
        this.setState({ engineerLocation: response.data[0].Location });
        this.setState({ engineerLat: response.data[0].latitude });
        this.setState({ engineerLng: response.data[0].longitude });
      });
  }
  render() {
    const footer = (
      <div>
        <Button label="OK" onClick={this.props.onHide} />
      </div>
    );
    return (
      <Dialog
        header={this.props.dialogHeading}
        visible={this.state.visible}
        style={{ width: "60vw" }}
        closable={false}
        footer={footer}
        onHide={this.props.onHide}
      >
        <div className="container">
          <div className="row">
            {this.state.ticketDetail.length !== 0 ? (
              <div className="col scrollable">
                <table className="table table-bordered w3-center w3-card-4 w3-small">
                  <tbody>
                    <tr>
                      <td>Ticket No</td>
                      <td> {this.state.ticketDetail[0].Ticket_No}</td>
                    </tr>
                    <tr>
                      <td>Customer Name</td>
                      <td> {this.state.ticketDetail[0].Customer_Name}</td>
                    </tr>
                    <tr>
                      <td>Location</td>
                      <td> {this.state.ticketDetail[0].Location}</td>
                    </tr>
                    <tr>
                      <td>Issue</td>
                      <td> {this.state.ticketDetail[0].Issue}</td>
                    </tr>
                    <tr>
                      <td>Engineer Assigned</td>
                      <td> {this.state.ticketDetail[0].Engineer_Assigned}</td>
                    </tr>
                    <tr>
                      <td>Engineer Location</td>
                      <td>{this.state.engineerLocation}</td>
                    </tr>
                    <tr>
                      <td>Status</td>
                      <td> {this.state.ticketDetail[0].Status}</td>
                    </tr>
                    <tr>
                      <td>Type of Assignment</td>
                      <td> {this.state.ticketDetail[0].Type_of_Assignment}</td>
                    </tr>
                    <tr>
                      <td>Raised Time</td>
                      <td>{this.state.ticketDetail[0].Raised_Time}</td>
                    </tr>
                    <tr>
                      <td>Assigned Time</td>
                      <td>{this.state.ticketDetail[0].Assigned_Time}</td>
                    </tr>
                    <tr>
                      <td>Work Started Time</td>
                      <td>{this.state.ticketDetail[0].Work_Started}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : null}
            <div className="col">
              {this.state.ticketDetail.length !== 0 ? (
                <GoogleMap
                  lat={this.state.ticketDetail[0].latitude}
                  lng={this.state.ticketDetail[0].longitude}
                  lat1={this.state.engineerLat}
                  lng1={this.state.engineerLng}
                />
              ) : null}
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default DialogDisplay;
