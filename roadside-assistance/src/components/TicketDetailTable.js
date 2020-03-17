import React, { Component } from "react";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import GoogleMap from "./Maps";
import axios from "axios";
class TicketDetailTable extends Component {
  state = {
    visible: false,
    ticketDetail: [],
    dialogInfo: "customer detail",
    engineerDetails: [],
    dialogHeading: "Ticket Details",
    sureVisible: false,
    textAreaValue: ""
  };

  onrowClick = () => {
    console.log("row clicked");
  };

  updateEngineer = request => {
    console.log("in engineer update");
    axios
      .put("http://192.168.0.102:5001/update/engineerdetail", { data: request })
      .then(response => {
        console.log(response);
      });
  };

  onClick = detail => {
    this.setState({ visible: true });
    this.setState({ ticketDetail: detail });
    console.log("detail", detail);
    axios
      .get("http://192.168.0.102:5001/get/engineerdetail/ticket_no_based", {
        params: {
          TicketNo: detail.Ticket_No
        }
      })
      .then(response => {
        console.log("engineer detail", response.data);
        this.setState({ engineerLocation: response.data[0].Location });
        this.setState({ engineerLat: response.data[0].latitude });
        this.setState({ engineerLng: response.data[0].longitude });
      });
  };
  onrowClickEngineer = index => {
    this.state.engineerDetails.map((engineer, indexforMarker) => {
      if (indexforMarker === index) {
        this.setState({
          engineerLat: this.state.engineerDetails[index].latitude
        });
        this.setState({
          engineerLng: this.state.engineerDetails[index].longitude
        });
        this.setState({ engineerName: engineer.Name });
      }
    });
  };
  onHide = () => {
    this.setState({ visible: false });
    this.setState({ dialogInfo: "customer detail" });
  };
  onsureHide = () => {
    this.setState({ sureVisible: false });
  };
  onAssign = () => {
    this.setState({ dialogInfo: "engineer list" });
    this.setState({ dialogHeading: "Engineer Details" });
    axios
      .get("http://192.168.0.102:5001/get/engineerdetails")
      .then(response => {
        console.log("engineer details", response);
        this.setState({ engineerDetails: response.data });
      });
  };

  onAssignEngineer = index => {
    this.onHide();
    this.setState({ sureVisible: true });
    console.log("selected engineer", this.state.engineerDetails[index]);
    this.setState({ assignedEngineer: this.state.engineerDetails[index] });
  };

  onConfirm = () => {
    console.log("customer detail", this.state.ticketDetail);
    console.log("engineer detail", this.state.assignedEngineer);
    this.onsureHide();
    let req_Obj = {};
    let first_val = {};
    let second_val = {};
    let third_val = {};
    first_val["TicketNo"] = this.state.ticketDetail.Ticket_No;
    second_val["EngineerAssigned"] = this.state.assignedEngineer.Name;
    third_val["AssignmentType"] = "Manual";
    req_Obj = Object.assign(first_val, second_val, third_val);
    console.log("req is", req_Obj);
    axios
      .put("http://192.168.0.102:5001/update/ticketinfo", { data: req_Obj })
      .then(res => {
        console.log(res);
        this.props.refreshUnassigned();
        this.props.refreshAssigned();
        this.props.refreshOngoing();
        this.props.refreshTable();
        //this.updateEngineer(req_Obj);
        //this.props.updateWaitingTime();
      });

    //reflect the changes in the customer app

    let request,
      firstval = {},
      secondval = {},
      thirdval = {};
    firstval["from"] = "Pending";
    secondval["to"] = "Processing";
    thirdval["message"] = this.state.textAreaValue;
    request = Object.assign({}, firstval, secondval, thirdval);
    console.log("request for update", request);
    axios
      .put(`http://192.168.0.102:5001/update/status`, { data: request })
      .then(response => {
        console.log(response);
      });

    axios
      .put(`http://192.168.0.102:5001/update/webportal/assigned`, {
        data: req_Obj
      })
      .then(res => {
        console.log(res);
      });
    axios
      .put(`http://192.168.0.102:5001/update/engineerdetail`, { data: req_Obj })
      .then(resp => console.log(resp));
  };

  tableBody = () => {
    if (this.props.tableData.length !== 0) {
      let body = [];
      let tablebody = this.props.tableData;
      for (let i in tablebody) {
        body.push(
          <tr
            key={i}
            onClick={() => this.onClick(tablebody[i])}
            style={{ cursor: "pointer" }}
          >
            <td>{tablebody[i].Ticket_No}</td>
            <td>{tablebody[i].Customer_Name}</td>
            <td>{tablebody[i].Location}</td>
            <td>{tablebody[i].Issue}</td>
            <td>{tablebody[i].Engineer_Assigned}</td>
            <td>{tablebody[i].Status}</td>
            <td>{tablebody[i].Time}</td>
            {/* <td>{tablebody[i].Raised_Time}</td>
            <td>{tablebody[i].Assigned_Time}</td>
            <td>{tablebody[i].Work_Started}</td> */}
          </tr>
        );
      }
      return body;
    }
  };
  handleChange = event => {
    this.setState({ textAreaValue: event.target.value });
  };
  render() {
    const footer = (
      <div>
        <Button label="OK" onClick={this.onHide} />
      </div>
    );

    const sureFooter = (
      <div>
        <Button label="confirm" onClick={this.onConfirm} />
        <Button label="cancel" onClick={this.onsureHide} />
      </div>
    );
    return (
      <div>
        <Dialog
          header={this.state.dialogHeading}
          visible={this.state.visible}
          style={{ width: "60vw" }}
          closable={false}
          footer={footer}
          onHide={this.onHide}
        >
          <div className="container">
            <div className="row">
              {this.state.ticketDetail.length !== 0 ? (
                <div className="col scrollable">
                  <table className="table table-bordered w3-center w3-card-4 w3-small">
                    {this.state.dialogInfo === "customer detail" ? (
                      <tbody>
                        <tr>
                          <td>Ticket No</td>
                          <td> {this.state.ticketDetail.Ticket_No}</td>
                        </tr>
                        <tr>
                          <td>Customer Name</td>
                          <td> {this.state.ticketDetail.Customer_Name}</td>
                        </tr>
                        <tr>
                          <td>Location</td>
                          <td> {this.state.ticketDetail.Location}</td>
                        </tr>
                        <tr>
                          <td>Issue</td>
                          <td> {this.state.ticketDetail.Issue}</td>
                        </tr>
                        <tr>
                          <td>Engineer Assigned</td>
                          {this.state.ticketDetail.Engineer_Assigned === "-" ? (
                            <td>
                              <Button
                                label="Assign"
                                onClick={this.onAssign}
                              ></Button>
                            </td>
                          ) : (
                            <td>{this.state.ticketDetail.Engineer_Assigned}</td>
                          )}
                        </tr>
                        <tr>
                          <td>Engineer Location</td>
                          <td>{this.state.engineerLocation}</td>
                        </tr>
                        <tr>
                          <td>Status</td>
                          <td> {this.state.ticketDetail.Status}</td>
                        </tr>
                        <tr>
                          <td>Type of Assignment</td>
                          <td> {this.state.ticketDetail.Type_of_Assignment}</td>
                        </tr>
                        {/* <tr>
                          <td>Time</td>
                          <td>{this.state.ticketDetail.Time}</td>
                        </tr> */}
                        <tr>
                          <td>Raised Time</td>
                          <td>{this.state.ticketDetail.Raised_Time}</td>
                        </tr>
                        <tr>
                          <td>Assigned Time</td>
                          <td>{this.state.ticketDetail.Assigned_Time}</td>
                        </tr>
                        <tr>
                          <td>Work Started Time</td>
                          <td>{this.state.ticketDetail.Work_Started}</td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody>
                        {this.state.engineerDetails.map((engineer, index) => (
                          <tr
                            key={index}
                            onClick={() => this.onrowClickEngineer(index)}
                            style={{ cursor: "pointer" }}
                          >
                            <td>{engineer.Name}</td>
                            <td>{engineer.Location}</td>
                            <td>{engineer.Status}</td>
                            <td>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => this.onAssignEngineer(index)}
                              >
                                assign
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                </div>
              ) : null}

              <div className="col">
                <GoogleMap
                  lat={this.state.ticketDetail.latitude}
                  lng={this.state.ticketDetail.longitude}
                  lat1={this.state.engineerLat}
                  lng1={this.state.engineerLng}
                  engineerName={
                    this.state.engineerName ? this.state.engineerName : null
                  }
                  engineerDetail={this.state.engineerDetails}
                />
              </div>
            </div>
          </div>
        </Dialog>
        <Dialog
          visible={this.state.sureVisible}
          style={{ width: "30vw" }}
          closable={false}
          footer={sureFooter}
          onHide={this.onsureHide}
        >
          {this.state.assignedEngineer ? (
            <div>
              <span style={{ margin: 10 }}>
                <b>{this.state.assignedEngineer.Name}</b> from
                <b> {this.state.assignedEngineer.Location}</b> will be assigned.{" "}
                <br />
              </span>
              <textarea
                className="form-control"
                style={{ marginTop: 10 }}
                rows="2"
                placeholder="Please enter your message.."
                value={this.state.textAreaValue}
                onChange={this.handleChange}
              ></textarea>
            </div>
          ) : null}
        </Dialog>

        <div className="scrollable">
          <table
            id="table"
            className="table table-bordered w3-center w3-card-4 w3-small table-hover"
          >
            <thead>
              <tr className="w3-light-grey">
                <th>Ticket no</th>
                <th>Customer Name</th>
                <th>Location</th>
                <th>Issue</th>
                <th>Engineer Assigned</th>
                <th>Status</th>
                <th>Time</th>
                {/* <th>Raised Time</th>
                <th>Assigned Time</th>
                <th>Work Started Time</th> */}
              </tr>
            </thead>

            <tbody>{this.tableBody()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default TicketDetailTable;
