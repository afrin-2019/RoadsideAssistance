import React, { Component } from "react";
import { Container, Col, Row } from "react-bootstrap";
import axios from "axios";
import TicketDetailTable from "./TicketDetailTable";
import TableDisplay from "./TableDisplay";

class EngineerDetails extends Component {
  state = {
    engineerDetails: []
  };
  componentDidMount() {
    axios
      .get("http://192.168.0.102:5001/get/engineerdetails")
      .then(response => {
        console.log("engineer details", response);
        this.setState({ engineerDetails: response.data });
      });
  }
  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col xs lg="1" className="p-3 mb-2 bg-gradient text-white"></Col>
            <Col className="p-3 mb-2 bg-gradient text-white">
              <h1 className="header-center">Engineer Details</h1>
              <span className="subtitle">
                Table of information about Engineers
              </span>
            </Col>
          </Row>
          <Row>
            <Col xs lg="1"></Col>
            <Col>
              <TableDisplay
                tableDetail={this.state.engineerDetails}
                dialogHeading="Engineer Details"
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default EngineerDetails;
