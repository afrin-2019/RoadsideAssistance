import React from "react";
import { Navbar, Form, FormControl, Button } from "react-bootstrap";
function TitleBar() {
  return (
    <div className="sticky-nav">
      <Navbar bg="white" expand="lg">
        <Navbar.Brand style={{ fontWeight: "bold" }}>
          <img
            src={require("../components/Wisdom_Circle_Logo.png")}
            style={{ width: 100, height: 50 }}
          />
          Wisdom Circle Technologies Pvt Ltd
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
      </Navbar>
    </div>
  );
}

export default TitleBar;
