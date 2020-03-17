import React, {Component} from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import {YellowBox} from 'react-native';

import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Dialog, {DialogContent} from 'react-native-popup-dialog';
import axios from 'axios';
import {Root, Popup} from 'popup-ui';
import CarDetails from './components/CarDetails';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import io from 'socket.io-client';
import Feedback from './components/Feedback';
let statedProblem, carNumber, ModelNo, PhoneNo;
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
      error: null,
      questionNo: 0,
      visible: false,
      problem: '',
      mechanicdetails: [],
      mechanicArrivalStatus: 'is arriving',
      mechanicCoordinate: {
        latitude: 12.972442,
        longitude: 77.600643,
      },
      customerDetails: '',
    };
  }
  componentDidMount() {
    YellowBox.ignoreWarnings([
      'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
    ]);

    this.socket = io('http://192.168.0.102:5001');
    Geolocation.getCurrentPosition(
      position => {
        console.log('position', position);
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      error => this.setState({error: error.message}),
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 2000},
    );
    // axios
    //   .get(`http://192.168.0.102:5001/get/generateticketno`)
    //   .then(response => console.log('ticket no', response.data));
    axios
      .get(`http://192.168.0.102:5001/get/customerdetails`)
      .then(response => {
        console.log('customer details', response.data);
        this.setState({customerDetails: response.data[0]});
      });
    axios
      .get(`http://192.168.0.102:5001/get/mechanicdetails`)
      .then(response => {
        console.log('mechanic location', response.data);
        this.setState({mechanicdetails: response.data});
      });
    axios
      .get(`http://192.168.0.102:5001/get/ticketdetails/processing`)
      .then(response => {
        console.log('ticket details', response.data);
        if (response.data.length !== 0) {
          alert('A mechanic will reach you soon');
          this.setState({questionNo: 5});
        }
      });
  }

  handleLocation = () => {
    //this.setState({visible: true});
    if (this.state.mechanicdetails.length === 0) {
      console.log('no details of mechanic');
      this.setState({questionNo: 9});
    } else {
      console.log('mechanic available');

      //Popup.hide();
      console.log(
        'latitude is ',
        this.state.latitude + 'longitude is ',
        this.state.longitude,
      );
      console.log('car details', statedProblem, carNumber, ModelNo, PhoneNo);
      let request = {
        lattitude: this.state.latitude,
        longitude: this.state.longitude,
        problem: statedProblem,
        Car_Number: carNumber,
        Model_Number: ModelNo,
        Phone_Number: PhoneNo,
      };
      let postReq = {
        Customer_Name: this.state.customerDetails.Name,
        Location: 'Banglore',
        Issue: statedProblem,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
      };
      console.log('request', request);
      //post details in RAISED TICKET collection
      axios
        .post(`http://192.168.0.102:5001/post/ticketdetails`, {
          data: request,
        })
        .then(response => {
          console.log('response', response.data);

          // post details in TICKETINFOWEBPORTAL collection
          axios
            .post(`http://192.168.0.102:5001/post/ticketinfo/webportal`, {
              data: postReq,
            })
            .then(response => {
              console.log(response);
            });
        })
        .catch(error => console.log('error', error));

      this.setState({questionNo: 7});
      this.socket.on('AcceptbyMechanic', msg => {
        //this.setState({StatusonMechanicAccept: msg});
        if (msg.to === 'Processing') {
          axios
            .get(`http://192.168.0.102:5001/get/ticketdetails/processing`)
            .then(response => {
              console.log('ticket details', response.data);
              if (response.data.length !== 0) {
                // if(msg.message.trim()===""){
                //   alert()
                // }
                alert(msg.message);
                this.setState({questionNo: 5});
              }
            });
        }
        if (msg.to === 'Closed') {
          axios
            .get(`http://192.168.0.102:5001/get/ticketdetails/closed`)
            .then(response => {
              console.log('ticket details', response.data);
              if (response.data.length !== 0) {
                alert('Thank you for using our service');
                this.setState({questionNo: 6});
              }
            });
        }
      });
      this.socket.on('validOTP', msg => {
        console.log('otp: ', msg);
        this.setState({mechanicArrivalStatus: 'has arrived'});
        this.setState({
          mechanicCoordinate: {
            latitude: this.state.latitude,
            longitude: this.state.longitude,
          },
        });
      });
    }
  };
  onClickYes = () => {
    this.setState({questionNo: 1});
  };

  onProblemSelect = problem => {
    this.setState({questionNo: 8});
    statedProblem = problem;
  };
  onOthersSelect = () => {
    this.setState({questionNo: 3});
  };
  onProvideDetails = (carNo, modelNo, PhNo) => {
    this.setState({questionNo: 4});
    carNumber = carNo;
    ModelNo = modelNo;
    PhoneNo = PhNo;
    console.log(carNo, modelNo, PhNo);
  };
  onSubmitFeedback = () => {
    this.setState({questionNo: 0});
    this.setState({mechanicArrivalStatus: 'is arriving'});
  };
  onAccept = () => {
    this.setState({questionNo: 2});
  };
  onReject = () => {
    this.setState({questionNo: 1});
  };

  render() {
    //this.socket.on('MechanicAccepted', msg => console.log(msg));
    console.log('stated problem', statedProblem, carNumber, ModelNo, PhoneNo);
    const problemList = (
      <View>
        <Text style={styles.contentfont}>
          What car troubles are you having?
        </Text>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, margin: 3}}>
            <Button
              title="Tyre Puncture"
              onPress={() => this.onProblemSelect('Tyre Puncture')}
            />
          </View>
          <View style={{flex: 1, margin: 3}}>
            <Button
              title="Fuel problem"
              onPress={() => this.onProblemSelect('Fuel problem')}
            />
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, margin: 3}}>
            <Button
              title="Battery dead"
              onPress={() => this.onProblemSelect('Battery dead')}
            />
          </View>
          <View style={{flex: 1, margin: 3}}>
            <Button
              title="Overheating"
              onPress={() => this.onProblemSelect('Overheating')}
            />
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Button
              title="Others"
              style={{width: 5}}
              onPress={this.onOthersSelect}
            />
          </View>
        </View>
      </View>
    );
    return (
      <Root>
        <View style={styles.container}>
          <MapView
            showUserLocation
            style={styles.map}
            initialRegion={{
              latitude: 12.952442,
              longitude: 77.590643,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            // customMapStyle={mapStyle}
            // onRegionChange={this.onRegionChange}
          >
            <Marker
              coordinate={this.state}
              draggable={true}
              coordinate={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
              }}
              onDragEnd={e => {
                alert(JSON.stringify(e.nativeEvent.coordinate));
                this.setState({latitude: e.nativeEvent.coordinate.latitude}),
                  this.setState({
                    longitude: e.nativeEvent.coordinate.longitude,
                  });
              }}
              title={'Your Location'}
            />
            {this.state.questionNo === 2 || this.state.questionNo === 4
              ? this.state.mechanicdetails.map(marker => (
                  // console.log('marker', marker);
                  <Marker
                    key={marker._id}
                    coordinate={{
                      latitude: marker.lattitude,
                      longitude: marker.longitude,
                    }}
                    // title={'marker'}
                  >
                    <Image
                      source={require('./android/app/src/carimage.png')}
                      style={{height: 40, width: 40}}
                    />
                  </Marker>
                ))
              : null}
            {this.state.questionNo === 5 ? (
              <Marker
                coordinate={this.state.mechanicCoordinate}
                title={'Mechanic Location'}>
                <Image
                  source={require('./android/app/src/carimage.png')}
                  style={{height: 40, width: 40}}
                />
              </Marker>
            ) : null}
          </MapView>
          <View style={styles.content}>
            {this.state.questionNo === 0 ? (
              <View>
                <Text style={styles.topfont}>
                  Good morning {this.state.customerDetails.Name}
                </Text>
                <Text style={styles.contentfont}>Are you struck??</Text>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1, margin: 10}}>
                    <Button title="Yes" onPress={this.onClickYes} />
                  </View>

                  <View style={{flex: 1, margin: 10}}>
                    <Button
                      title="No"
                      onPress={() =>
                        Popup.show({
                          type: 'Success',
                          title: 'Good to Go!!',
                          button: true,
                          textBody: 'Please click on "YES" if you are struck',
                          buttontext: 'Ok',
                          callback: () => Popup.hide(),
                        })
                      }
                    />
                  </View>
                </View>
              </View>
            ) : null}
            {this.state.questionNo === 1 ? problemList : null}
            {this.state.questionNo === 4 ? (
              <View>
                <Text style={styles.contentfont}>
                  Please share your current location
                </Text>
                <View style={{margin: 10}}>
                  <Button
                    title="Share Location"
                    // onPress={() =>
                    //   Popup.show({
                    //     type: 'Success',
                    //     title: 'Ticket Raised',
                    //     button: false,
                    //     textBody: 'Connecting you to nearby mechanic',
                    //     buttontext: 'Ok',
                    //     callback: this.handleLocation,
                    //   })
                    // }
                    onPress={this.handleLocation}
                  />
                </View>
              </View>
            ) : null}
            {this.state.questionNo === 2 ? (
              <CarDetails
                onclickyes={this.onClickYes}
                onclicknext={this.onProvideDetails}
                cardetails={this.state.customerDetails}
              />
            ) : null}
            {this.state.questionNo === 3 ? (
              <View>
                <Text style={styles.contentfont}>
                  What other car troubles are you having
                </Text>

                <TextInput
                  style={styles.input}
                  onChangeText={text => this.setState({input: text})}
                />

                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1, margin: 10}}>
                    <Button title="Back" onPress={this.onClickYes} />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      margin: 10,
                    }}>
                    <Button
                      title="Next"
                      onPress={() => this.onProblemSelect(this.state.input)}
                    />
                  </View>
                </View>
              </View>
            ) : null}
            {this.state.questionNo === 5 ? (
              <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 18}}>
                  your mechanic {this.state.mechanicArrivalStatus}
                </Text>
                {this.state.mechanicArrivalStatus === 'is arriving' ? (
                  <Text style={{backgroundColor: 'yellow'}}>OTP - 4321</Text>
                ) : null}

                <Image
                  source={require('./android/app/src/cartoon-men.png')}
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 50,
                    margin: 10,
                  }}
                />

                <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
                  BALAJI N
                </Text>
                <Text>8790654321</Text>
                <View style={{flexDirection: 'row'}}>
                  <View style={{margin: 10}}>
                    <Button title="call" />
                  </View>
                  <View style={{margin: 10}}>
                    <Button title="cancel" />
                  </View>
                </View>
              </View>
            ) : null}
            {this.state.questionNo === 6 ? (
              <View>
                <Feedback onSubmit={this.onSubmitFeedback} />
              </View>
            ) : null}
            {this.state.questionNo === 7 ? (
              <View style={{alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 22}}>
                  Ticket Raised
                </Text>
                <Text>Connecting you to nearby mechanic....</Text>
              </View>
            ) : null}
            {this.state.questionNo === 8 ? (
              <View style={{alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold', fontSize: 22}}>
                  Minimum Service cost - Rs.100
                </Text>
                <Text>
                  Mechanic will assess and decide the total cost onsite
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <View style={{margin: 10}}>
                    <Button title="Accept" onPress={this.onAccept} />
                  </View>
                  <View style={{margin: 10}}>
                    <Button title="Reject" onPress={this.onReject} />
                  </View>
                </View>
              </View>
            ) : null}
            {this.state.questionNo === 9 ? (
              <View style={{alignItems: 'center'}}>
                <Text>All mechanics are busy.</Text>
                <Text>Please connect to call center</Text>
                <View style={{alignItems: 'center', margin: 10}}>
                  <Button title="Call" />
                </View>
              </View>
            ) : null}
          </View>
          <View style={{alignItems: 'center', justifyContent: 'flex-end'}}>
            <Image
              source={require('./android/app/src/Wisdom_Circle_Logo.png')}
              style={{
                height: 30,
                width: 50,
              }}
            />
            <Text style={{color: 'blue'}}>
              Wisdom Circle Technologies Pvt Ltd
            </Text>
          </View>
        </View>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    // flex: 1,
    paddingTop: 50,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    position: 'absolute',
    top: 300,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  topfont: {
    fontSize: 20,
    margin: 5,
  },
  contentfont: {
    fontSize: 20,
    textAlign: 'center',
  },
  buttoncontainer: {
    //flex: 1,
    flexDirection: 'row',
    //justifyContent: 'space-between',
    //margin: 3,
  },
  dialogStyle: {
    flex: 1,
  },
  input: {
    margin: 10,
    height: 40,
    borderColor: '#7a42f4',
    borderWidth: 1,
  },
});

//<Button title="Get Location" onPress={this.handleLocation} />

// var mapStyle = [
//   {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
//   {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
//   {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
//   {
//     featureType: 'administrative.locality',
//     elementType: 'labels.text.fill',
//     stylers: [{color: '#d59563'}],
//   },
//   {
//     featureType: 'poi',
//     elementType: 'labels.text.fill',
//     stylers: [{color: '#d59563'}],
//   },
//   {
//     featureType: 'poi.park',
//     elementType: 'geometry',
//     stylers: [{color: '#263c3f'}],
//   },
//   {
//     featureType: 'poi.park',
//     elementType: 'labels.text.fill',
//     stylers: [{color: '#6b9a76'}],
//   },
//   {
//     featureType: 'road',
//     elementType: 'geometry',
//     stylers: [{color: '#38414e'}],
//   },
//   {
//     featureType: 'road',
//     elementType: 'geometry.stroke',
//     stylers: [{color: '#212a37'}],
//   },
//   {
//     featureType: 'road',
//     elementType: 'labels.text.fill',
//     stylers: [{color: '#9ca5b3'}],
//   },
//   {
//     featureType: 'road.highway',
//     elementType: 'geometry',
//     stylers: [{color: '#746855'}],
//   },
//   {
//     featureType: 'road.highway',
//     elementType: 'geometry.stroke',
//     stylers: [{color: '#1f2835'}],
//   },
//   {
//     featureType: 'road.highway',
//     elementType: 'labels.text.fill',
//     stylers: [{color: '#f3d19c'}],
//   },
//   {
//     featureType: 'transit',
//     elementType: 'geometry',
//     stylers: [{color: '#2f3948'}],
//   },
//   {
//     featureType: 'transit.station',
//     elementType: 'labels.text.fill',
//     stylers: [{color: '#d59563'}],
//   },
//   {
//     featureType: 'water',
//     elementType: 'geometry',
//     stylers: [{color: '#17263c'}],
//   },
//   {
//     featureType: 'water',
//     elementType: 'labels.text.fill',
//     stylers: [{color: '#515c6d'}],
//   },
//   {
//     featureType: 'water',
//     elementType: 'labels.text.stroke',
//     stylers: [{color: '#17263c'}],
//   },
// ];
