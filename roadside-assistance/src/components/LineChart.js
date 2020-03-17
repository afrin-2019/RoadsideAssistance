import React from "react";
import { Line } from "react-chartjs-2";

const state = {
  labels: ["January", "February", "March", "April", "May"],
  datasets: [
    {
      label: "Tickets",
      fill: false,
      lineTension: 0.5,
      backgroundColor: "rgba(75,192,192,1)",
      borderColor: "rgba(0,0,0,1)",
      borderWidth: 2,
      data: [25, 39, 60, 61, 46]
    }
  ]
};

export default class LineChart extends React.Component {
  render() {
    return (
      <div>
        <Line
          data={state}
          options={{
            legend: {
              display: true,
              position: "right"
            }
          }}
        />
      </div>
    );
  }
}
