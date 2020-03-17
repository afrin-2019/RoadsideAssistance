import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import TitleBar from "./components/TitleBar";
import SideNavBar from "./components/SideNavBar";
import Dashboard from "./components/Dashboard";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import EngineerDetails from "./components/EngineerDetails";
import CustomerDetails from "./components/CustomerDetails";
import TicketHistory from "./components/TicketHistory";

function App() {
  return (
    <div>
      <TitleBar />
      <SideNavBar />
      <Router>
        <Switch>
          <Route exact path={"/"} component={Dashboard} />
          <Route exact path={"/engineer-details"} component={EngineerDetails} />
          <Route exact path={"/customer-details"} component={CustomerDetails} />
          <Route exact path={"/ticket-history"} component={TicketHistory} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
