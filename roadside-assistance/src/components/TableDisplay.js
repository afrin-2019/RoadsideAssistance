import React, { Component } from "react";
import DialogDisplay from "./DialogDisplay";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
let dialogHeader = [];
class TableDisplay extends Component {
  state = {
    visible: false,
    showDialog: false,
    dialogContent: []
  };

  onHide = () => {
    this.setState({ visible: false });
  };
  onClick = data => {
    this.setState({ visible: true });
    console.log("data", data);
    this.setState({ dialogContent: data });
  };

  onTicketnoClick = ticketno => {
    this.setState({ visible: false });
    this.setState({ clickedTicket: ticketno });
    this.setState({ showDialog: true });
  };

  onHideDialog = () => {
    this.setState({ showDialog: false });
  };

  headerDisplay = () => {
    let td = this.props.tableDetail[0]; //assigning first record to a variable
    let data = [],
      i = 1,
      x;
    dialogHeader = [];
    for (x in td) {
      //pushing 'th' elememt with header name into the array
      if (
        x !== "_id" &&
        x !== "latitude" &&
        x !== "longitude" &&
        x !== "Status"
      ) {
        data.push(<th key={i}>{x}</th>);
        dialogHeader.push(x);
        i++;
      }
    }
    return data;
  };

  bodyDisplay = () => {
    let td = this.props.tableDetail; //assigning the entire productlist to a variable
    let data = [],
      data1 = [],
      j = 1,
      k = 1;

    for (let i in td) {
      //iterating every record
      data = [];
      for (let x in td[i]) {
        if (
          x !== "_id" &&
          x !== "latitude" &&
          x !== "longitude" &&
          x !== "Status"
        ) {
          if (x === "Ticket_No" && td[i][x].length > 1) {
            data.push(
              <td key={j}>
                {td[i][x].map((value, index) => (
                  <span key={index}>
                    {value} <br />
                  </span>
                ))}
              </td>
            );
          } else {
            data.push(<td key={j}>{td[i][x]}</td>);
          }
          j++;
        }
      }
      data1.push(
        <tr
          key={k}
          onClick={() => this.onClick(td[i])}
          style={{ cursor: "pointer" }}
        >
          {data}
        </tr>
      );
      k++;
    }

    return data1;
  };

  render() {
    const footer = (
      <div>
        <Button label="OK" onClick={this.onHide} />
      </div>
    );

    let dialogDisplay = dialogHeader.map((header, index) => {
      return (
        <tr key={index}>
          <td>{header}</td>
          {header === "Ticket_No" ? (
            <td>
              {this.state.dialogContent[header].map((ticketno, index) => (
                <button
                  key={index}
                  className="btn btn-sm btn-link"
                  onClick={() => this.onTicketnoClick(ticketno)}
                >
                  {ticketno}
                </button>
              ))}
            </td>
          ) : (
            <td>{this.state.dialogContent[header]}</td>
          )}
        </tr>
      );
    });
    return (
      <div>
        <table
          className="table table-bordered w3-center w3-card-4 w3-small table-hover "
          style={{ margin: 10 }}
        >
          <thead>
            <tr className="w3-light-grey">{this.headerDisplay()}</tr>
          </thead>
          <tbody>{this.bodyDisplay()}</tbody>
        </table>
        {this.state.showDialog ? (
          <DialogDisplay
            dialogHeading="Customer Details"
            onHide={this.onHideDialog}
            ticketNo={this.state.clickedTicket}
          />
        ) : null}
        <Dialog
          header={this.props.dialogHeading}
          visible={this.state.visible}
          style={{ width: "30vw" }}
          closable={false}
          footer={footer}
          onHide={this.onHide}
        >
          <table className="table table-bordered w3-center w3-card-4 w3-small">
            <tbody>{dialogDisplay}</tbody>
          </table>
        </Dialog>
      </div>
    );
  }
}

export default TableDisplay;
