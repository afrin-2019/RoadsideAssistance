import React, { Component } from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import TicketDetailTable from "./TicketDetailTable";
import axios from "axios";
import io from "socket.io-client";
class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableData: [],
      openTicket: 0,
      unassignedTicket: 0,
      assignedTicket: 0,
      ongoingTicket: 0,
      unassignedTicketDetails: [],
      less_than_5mins: 0,
      five_to_ten_mins: 0,
      ten_to_fifteen_mins: 0,
      more_than_fifteen_mins: 0,
      time: new Date().toLocaleString()
    };
  }

  componentDidMount() {
    this.socket = io("http://192.168.0.102:5001");
    this.socket.on("TicketRaisedbyUser", msg => {
      this.refreshPage();
    });
    this.socket.on("Assigned", msg => {
      this.refreshPage();
    });
    this.socket.on("WorkStarted", msg => {
      this.refreshPage();
    });
    this.socket.on("Closed", msg => {
      this.refreshPage();
    });
    this.refreshPage();
    //this.intervalID = setInterval(() => this.tick(), 10000);
  }

  refreshPage = () => {
    this.onUnassignedTicket();
    this.onassignedTicket();
    this.ongoingTicket();
    this.onopenTicket();
    this.tick();
  };

  tick() {
    this.setState(
      {
        time: new Date().toLocaleString()
      }
      // () => {
      //   this.checkWaitingTime();
      // }
    );
  }
  getTicketStatus = () => {
    if (this.state.tableData.length !== 0) {
      this.state.tableData.map(ticket => {
        if (ticket.Status === "assigned") {
          this.setState(state => ({
            assignedTicket: state.assignedTicket + 1
          }));
        }
        if (ticket.Status === "ongoing") {
          this.setState(state => ({
            ongoingTicket: state.ongoingTicket + 1
          }));
        }
      });
    }
  };

  onopenTicket = () => {
    axios
      .get("http://192.168.0.102:5001/get/ticketinfo")
      .then(response => {
        console.log("response", response);
        this.setState(
          { tableData: response.data }
          //   () => {
          //   this.getTicketStatus();
          // }
        );
        this.setState({ openTicket: response.data.length });
      })
      .then(error => console.log(error));
  };

  onUnassignedTicket = () => {
    axios
      .get("http://192.168.0.102:5001/get/ticketinfo/unassigned")
      .then(response => {
        console.log("response", response);
        this.setState({ tableData: response.data });
        this.setState({ unassignedTicketDetails: response.data }, () =>
          console.log("unassigned details", this.state.unassignedTicketDetails)
        );
        this.setState({ unassignedTicket: response.data.length }, () => {
          console.log("unassigned", this.state.unassignedTicket);
        });
        this.checkWaitingTime();
      });
  };

  onassignedTicket = () => {
    axios
      .get("http://192.168.0.102:5001/get/ticketinfo/assigned")
      .then(response => {
        console.log("response", response);
        this.setState({ tableData: response.data });
        this.setState({ assignedTicket: response.data.length });
      });
  };

  ongoingTicket = () => {
    axios
      .get("http://192.168.0.102:5001/get/ticketinfo/ongoing")
      .then(response => {
        console.log("response", response);
        this.setState({ tableData: response.data });
        this.setState({ ongoingTicket: response.data.length });
      });
  };

  onbuttonClick = () => {
    console.log("button clicked");
  };

  checkWaitingTime = () => {
    console.log("inside check waiting");
    console.log(
      "<5",
      this.state.less_than_5mins + "5-10",
      this.state.five_to_ten_mins + "10-15",
      this.state.ten_to_fifteen_mins + ">15",
      this.state.more_than_fifteen_mins
    );
    this.setState({ less_than_5mins: 0 });
    this.setState({ five_to_ten_mins: 0 });
    this.setState({ ten_to_fifteen_mins: 0 });
    this.setState({ more_than_fifteen_mins: 0 });
    if (this.state.unassignedTicketDetails.length !== 0) {
      this.state.unassignedTicketDetails.map(ticket => {
        console.log("ticket", ticket.Ticket_No);
        var today = new Date();
        var ticketUnassignedDate = new Date(ticket.Time);
        var diffMs = today - ticketUnassignedDate; // milliseconds between now & unassigned
        var diffDays = Math.floor(diffMs / 86400000); // days
        var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
        var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
        console.log(diffDays + " Days", diffHrs + " Hrs", diffMins + " mins");
        if (diffDays === 0) {
          if (diffHrs === 0) {
            if (diffMins <= 5) {
              this.setState(
                { less_than_5mins: this.state.less_than_5mins + 1 },
                () => {
                  console.log("<5", this.state.less_than_5mins);
                }
              );
            } else if (diffMins > 5 && diffMins <= 10) {
              this.setState(
                { five_to_ten_mins: this.state.five_to_ten_mins + 1 },
                () => {
                  console.log("5-10", this.state.five_to_ten_mins);
                }
              );
            } else if (diffMins > 10 && diffMins <= 15) {
              this.setState(
                { ten_to_fifteen_mins: this.state.ten_to_fifteen_mins + 1 },
                () => {
                  console.log("10-15", this.state.ten_to_fifteen_mins);
                }
              );
            } else if (diffMins > 15) {
              this.setState(
                {
                  more_than_fifteen_mins: this.state.more_than_fifteen_mins + 1
                },
                () => {
                  console.log(">15", this.state.more_than_fifteen_mins);
                }
              );
            }
          }
        }
        if (diffDays > 0) {
          console.log("difference in days", diffDays, diffHrs);
          this.setState(
            {
              more_than_fifteen_mins: this.state.more_than_fifteen_mins + 1
            },
            () => {
              console.log(">15", this.state.more_than_fifteen_mins);
            }
          );
        } else if (diffHrs > 0) {
          this.setState(
            {
              more_than_fifteen_mins: this.state.more_than_fifteen_mins + 1
            },
            () => {
              console.log(">15", this.state.more_than_fifteen_mins);
            }
          );
        }
      });
    }
    console.log(
      "<5",
      this.state.less_than_5mins + "5-10",
      this.state.five_to_ten_mins + "10-15",
      this.state.ten_to_fifteen_mins + ">15",
      this.state.more_than_fifteen_mins
    );
  };

  render() {
    console.log(this.state.time);
    let labelOpenTicket = "Open Tickets";
    let XOpenTicket = ["Assigned", "Ongoing", "Unassigned"];
    let YOpenTicket = [
      this.state.assignedTicket,
      this.state.ongoingTicket,
      this.state.unassignedTicket
    ];
    let barColorOpenTicket = ["#ffbf00", "#5cb85c", "#d9534f"];
    let labelWaitingTime = "Unassigned";
    let XWaitingTime = ["<5mins", "5-10mins", "10-15mins", ">15mins"];
    let YWaitingTime = [
      this.state.less_than_5mins,
      this.state.five_to_ten_mins,
      this.state.ten_to_fifteen_mins,
      this.state.more_than_fifteen_mins
    ];
    let barColorWaitingTime = "#d9534f";
    return (
      <div
      //style={{ position: "relative", zIndex: "1" }}
      >
        <Container>
          <Row className="p-3 mb-2 bg-gradient text-white">
            <Col xs lg="1"></Col>
            <Col>
              <h1>Dashboard</h1>
              <span className="subtitle" style={{ color: "white" }}>
                Overview and content summary
              </span>
            </Col>
          </Row>
          <Row style={{ margin: 10 }}>
            <Col xs lg="1"></Col>
            <Col xs lg="5" style={{ margin: 10 }}>
              <Card style={{ width: "30rem" }}>
                <Card.Header style={{ color: "blue", fontWeight: 500 }}>
                  Open Tickets
                </Card.Header>
                <div style={{ margin: 10 }}>
                  <BarChart
                    xaxis={XOpenTicket}
                    yaxis={YOpenTicket}
                    bgBarcolor={barColorOpenTicket}
                    label={labelOpenTicket}
                  />
                </div>
              </Card>
            </Col>
            <Col xs lg="5" style={{ margin: 10 }}>
              <Card style={{ width: "30rem" }}>
                <Card.Header style={{ color: "blue", fontWeight: 500 }}>
                  Unassigned Ticket - Waiting Time
                </Card.Header>
                <div style={{ margin: 10 }}>
                  <BarChart
                    xaxis={XWaitingTime}
                    yaxis={YWaitingTime}
                    bgBarcolor={barColorWaitingTime}
                    label={labelWaitingTime}
                  />
                </div>
              </Card>
            </Col>
          </Row>
          <Row style={{ margin: 10 }}>
            <Col xs lg="1"></Col>
            <Col>
              <Card
                bg="primary"
                text="white"
                style={{ minWidth: "14rem", maxWidth: "14rem" }}
              >
                <Card.Body>
                  {/* <Card.Title className="align-items-center d-flex justify-content-center">
                    Open tickets
                  </Card.Title> */}
                  <Card.Text className="align-items-center d-flex justify-content-center">
                    <span style={{ fontWeight: "bold", fontSize: 20 }}>
                      Open - {this.state.openTicket}
                    </span>
                  </Card.Text>
                </Card.Body>

                <Card.Footer>
                  <button
                    className="btn btn-link"
                    style={{ color: "white" }}
                    onClick={this.onopenTicket}
                  >
                    View Details
                    <i
                      className="fa fa-fw fa-angle-right"
                      style={{ marginLeft: 40 }}
                    ></i>
                  </button>
                </Card.Footer>
              </Card>
            </Col>
            <Col>
              <Card
                bg="danger"
                text="white"
                style={{ minWidth: "14rem", maxWidth: "14rem" }}
              >
                <Card.Body>
                  {/* <Card.Title className="align-items-center d-flex justify-content-center">
                    Unassigned tickets
                  </Card.Title> */}
                  <Card.Text className="align-items-center d-flex justify-content-center">
                    <span style={{ fontWeight: "bold", fontSize: 20 }}>
                      Unassigned - {this.state.unassignedTicket}
                    </span>
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <button
                    className="btn btn-link"
                    style={{ color: "white" }}
                    onClick={this.onUnassignedTicket}
                  >
                    View Details
                    <i
                      className="fa fa-fw fa-angle-right"
                      style={{ marginLeft: 40 }}
                    ></i>
                  </button>
                </Card.Footer>
              </Card>
            </Col>
            <Col>
              <Card
                bg="success"
                text="white"
                style={{ minWidth: "14rem", maxWidth: "14rem" }}
              >
                <Card.Body>
                  {/* <Card.Title className="align-items-center d-flex justify-content-center">
                    Ongoing tickets
                  </Card.Title> */}
                  <Card.Text className="align-items-center d-flex justify-content-center">
                    <span style={{ fontWeight: "bold", fontSize: 20 }}>
                      Ongoing - {this.state.ongoingTicket}
                    </span>
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <button
                    className="btn btn-link"
                    style={{ color: "white" }}
                    onClick={this.ongoingTicket}
                  >
                    View Details
                    <i
                      className="fa fa-fw fa-angle-right"
                      style={{ marginLeft: 40 }}
                    ></i>
                  </button>
                </Card.Footer>
              </Card>
            </Col>
            <Col>
              <Card
                bg="warning"
                text="white"
                style={{ minWidth: "14rem", maxWidth: "14rem" }}
              >
                <Card.Body>
                  {/* <Card.Title className="align-items-center d-flex justify-content-center">
                    Assigned tickets
                  </Card.Title> */}
                  <Card.Text className="align-items-center d-flex justify-content-center">
                    <span style={{ fontWeight: "bold", fontSize: 20 }}>
                      Assigned - {this.state.assignedTicket}
                    </span>
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <button
                    className="btn btn-link"
                    style={{ color: "white" }}
                    onClick={this.onassignedTicket}
                  >
                    View Details
                    <i
                      className="fa fa-fw fa-angle-right"
                      style={{ marginLeft: 40 }}
                    ></i>
                  </button>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
          <Row style={{ margin: 20 }}>
            <Col xs lg="1" />
            <Col>
              <TicketDetailTable
                tableData={this.state.tableData}
                refreshTable={this.onopenTicket}
                refreshUnassigned={this.onUnassignedTicket}
                refreshAssigned={this.onassignedTicket}
                refreshOngoing={this.ongoingTicket}
                updateWaitingTime={this.checkWaitingTime}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Dashboard;
