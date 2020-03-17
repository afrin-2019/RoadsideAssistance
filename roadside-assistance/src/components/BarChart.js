import React from "react";
import { Bar } from "react-chartjs-2";

export default class BarChart extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const state = {
      labels: this.props.xaxis,
      datasets: [
        {
          label: this.props.label,
          backgroundColor: this.props.bgBarcolor,
          borderColor: "rgba(0,0,0,1)",
          borderWidth: 2,
          data: this.props.yaxis
        }
      ]
    };
    return (
      <div>
        <Bar
          data={state}
          options={{
            legend: {
              display: false
              //position: "right"
            }
          }}
        />
      </div>
    );
  }
}
