import React, { Component } from "react";
import { Container, Col, Row } from "react-bootstrap";
import axios from "axios";
import TableDisplay from "./TableDisplay";
class CustomerDetails extends Component {
  state = {
    customerDetails: []
  };
  componentDidMount() {
    axios.get("http://localhost:5001/get/customerdetails").then(response => {
      console.log("customer details", response);
      this.setState({ customerDetails: response.data });
    });
  }
  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col xs lg="1" className="p-3 mb-2 bg-gradient text-white"></Col>
            <Col className="p-3 mb-2 bg-gradient text-white">
              <h1 className="header-center">Customer Details</h1>
              <span className="subtitle">
                Table of information about Customers
              </span>
            </Col>
          </Row>
          <Row>
            <Col xs lg="1"></Col>
            <Col>
              <TableDisplay
                tableDetail={this.state.customerDetails}
                dialogHeading="Customer Details"
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default CustomerDetails;
