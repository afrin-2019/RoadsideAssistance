import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

class MapContainer extends Component {
  state = {};
  render() {
    console.log("engineer name", this.props.engineerName);
    return (
      <Map
        google={this.props.google}
        zoom={11}
        style={mapStyles}
        initialCenter={{ lat: 12.972442, lng: 77.580643 }}
      >
        <Marker
          position={{ lat: this.props.lat, lng: this.props.lng }}
          title="Customer Location"
        />
        {this.props.lat1 ? (
          <Marker
            position={{ lat: this.props.lat1, lng: this.props.lng1 }}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }}
            title={
              this.props.engineerName
                ? this.props.engineerName
                : "Engineer Location"
            }
          />
        ) : null}
        {this.props.engineerDetail
          ? this.props.engineerDetail.map((engineer, index) => {
              return (
                <Marker
                  key={index}
                  position={{ lat: engineer.latitude, lng: engineer.longitude }}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                  }}
                  title={engineer.Name}
                />
              );
            })
          : null}
      </Map>
    );
  }
}
const mapStyles = {
  width: "90%",
  minheight: "300px"
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyA1oWVs84jiiGO2OgcPukRE6SrIdmXTB2M"
})(MapContainer);
