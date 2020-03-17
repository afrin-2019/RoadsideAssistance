import React, { Component } from "react";

function SideNavBar() {
  // function openNav() {
  //   document.getElementById("mySidebar").style.width = "250px";
  //   document.getElementById("main").style.marginLeft = "250px";
  // }
  // function closeNav() {
  //   document.getElementById("mySidebar").style.width = "0";
  //   document.getElementById("main").style.marginLeft = "0";
  // }
  return (
    <React.Fragment>
      {/* <div id="main">
        <button className="openbtn" onClick={openNav}>
          ☰
        </button>
      </div> */}
      <div className="sidebar">
        {/* <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>
          ×
        </a> */}

        <a href="/">
          <i className="fa fa-fw fa-clipboard" style={{ margin: 10 }}></i>Ticket
          Details
        </a>
        <a href="/engineer-details">
          <i className="fa fa-fw fa-wrench" style={{ margin: 10 }}></i>
          Engineer Details
        </a>
        <a href="/customer-details">
          <i className="fa fa-fw fa-car" style={{ margin: 10 }}></i> Customer
          Details
        </a>
        <a href="/ticket-history">
          <i className="fa fa-fw fa-history" style={{ margin: 10 }} />
          History
        </a>
      </div>
    </React.Fragment>
  );
}

export default SideNavBar;
