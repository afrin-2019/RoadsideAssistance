import React, { Component } from "react";
import { GMap } from "primereact/gmap";

class GoogleMaps extends Component {
  constructor(props) {
    super(props);
  }
  state = {};
  render() {
    let latitude = this.props.lat;
    let longitude = this.props.long;
    const options = {
      center: { lat: 36.890257, lng: 30.707417 },
      zoom: 12
    };
    // const overlays = [
    //   new google.maps.Marker({
    //     position: { lat: latitude, lng: longitude },
    //     title: "Customer Location"
    //   })
    // ];
    return (
      <GMap
        //overlays={overlays}
        options={options}
        style={{ width: "100%", minHeight: "300px" }}
      />
    );
  }
}

export default GoogleMaps;
