import React, { Component } from "react";
import { Container, Col, Row } from "react-bootstrap";
import axios from "axios";
import TableDisplay from "./TableDisplay";
import TicketDetailTable from "./TicketDetailTable";
class TicketHistory extends Component {
  state = {
    closedTickets: []
  };
  componentDidMount() {
    axios
      .get("http://192.168.0.102:5001/get/ticketinfo/closed")
      .then(response => {
        console.log("closed ticket details", response);
        this.setState({ closedTickets: response.data });
      });
  }
  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col xs lg="1" className="p-3 mb-2 bg-gradient text-white"></Col>
            <Col className="p-3 mb-2 bg-gradient text-white">
              <h1 className="header-center">Ticket History</h1>
              <span className="subtitle">
                Table of information about Closed Tickets
              </span>
            </Col>
          </Row>
          <Row>
            <Col xs lg="1"></Col>
            <Col>
              {/* <TableDisplay
                tableDetail={this.state.closedTickets}
                dialogHeading="Ticket History"
              /> */}
              <TicketDetailTable tableData={this.state.closedTickets} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default TicketHistory;
