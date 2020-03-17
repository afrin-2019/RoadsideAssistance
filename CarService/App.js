/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  Image,
  TextInput,
  StatusBar,
  AppState,
} from 'react-native';
import axios from 'axios';
import {Root, Popup} from 'popup-ui';
import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {Card} from 'react-native-elements';
import io from 'socket.io-client';
import {AirbnbRating} from 'react-native-ratings';
import {YellowBox} from 'react-native';
import PushController from './components/PushController';
//import PushNotification from 'react-native-push-notification';
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0,
      error: null,
      UserDetails: '',
      contentScreenNo: 0,
      otp: '',
      engineerDetail: '',
      //appState: AppState.currentState,
    };
  }
  componentDidMount() {
    YellowBox.ignoreWarnings([
      'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?',
    ]);
    // PushNotification.configure({
    //   // (required) Called when a remote or local notification is opened or received
    //   onNotification: function(notification) {
    //     console.log('LOCAL NOTIFICATION ==>', notification);
    //   },
    // });
    // AppState.addEventListener('change', this.handleAppStateChange);
    this.socket = io('http://192.168.0.102:5001');
    (this.mechaniclatitude = 12.952442),
      (this.mechaniclongitude = 77.590643),
      Geolocation.getCurrentPosition(
        position => {
          console.log('position - ', position),
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null,
            });
        },
        error => this.setState({error: error.message}),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 2000},
      );
    axios
      .get(`http://192.168.0.102:5001/get/engineerdetails`)
      .then(response => {
        console.log('response', response.data[0]);
        this.setState({engineerDetail: response.data[0]});
      });
    axios.get(`http://192.168.0.102:5001/get/ticketdetails`).then(response => {
      console.log('response- ', response.data[0]);
      this.setState({UserDetails: response.data[0]});
      if (response.data.length !== 0) {
        alert('Ticket Raised');
      }
    });
    this.socket.on('TicketRaisedbyUser', msg => {
      console.log('msg', msg);
      axios
        .get(`http://192.168.0.102:5001/get/ticketdetails`)
        .then(response => {
          console.log('response- ', response.data[0]);
          this.setState({UserDetails: response.data[0]});
          if (response.data.length !== 0) {
            // console.log('appstate', this.state.appState);
            // if (
            //   this.state.appState === 'background' ||
            //   this.state.appState === 'active'
            // ) {
            //   PushNotification.localNotificationSchedule({
            //     //... You can use all the options from localNotifications
            //     playSound: true,
            //     message: 'A Ticket has been raised', // (required)
            //     date: new Date(Date.now() + 5 * 1000), // in 60 secs
            //   });
            // }
            alert('Ticket Raised');
          }
        });
      // this.setState({UserDetails: msg});
      // alert('Ticket Raised');
    });
    this.socket.on('Assigned', request => {
      axios
        .get('http://192.168.0.102:5001/get/ticketdetails/ticket_no_based', {
          params: {
            TicketNo: request.TicketNo,
          },
        })
        .then(response => {
          console.log(response);
          if (request.EngineerAssigned === this.state.engineerDetail.Name) {
            alert('Ticket No - ' + request.TicketNo + ' has been assigned ');
            this.setState({UserDetails: response.data[0]});
            this.setState({contentScreenNo: 5});
          }
        });
    });
  }

  // componentWillUnmount() {
  //   AppState.removeEventListener('change', this.handleAppStateChange);
  // }

  // handleAppStateChange = appState => {
  //   if (this.state.appState.match('background')) {
  //     PushNotification.localNotificationSchedule({
  //       //... You can use all the options from localNotifications
  //       message: 'A Ticket has been raised', // (required)
  //       date: new Date(Date.now() + 5 * 1000), // in 60 secs
  //     });
  //   }
  // };

  onSubmit = () => {
    this.setState({contentScreenNo: 0});
  };

  getTicketDetails = () => {
    this.setState({contentScreenNo: 1});
  };

  onAccept = () => {
    Popup.hide();
    let request,
      firstval = {},
      secondval = {},
      thirdval = {};
    firstval['from'] = 'Pending';
    secondval['to'] = 'Processing';
    thirdval['message'] = 'A mechanic will reach you soon';
    request = Object.assign({}, firstval, secondval, thirdval);
    console.log('request for update', request);
    axios
      .put(`http://192.168.0.102:5001/update/status`, {data: request})
      .then(response => {
        console.log(response);
      });
    let request1,
      firstval1 = {},
      secondval1 = {},
      thirdval1 = {};
    firstval1['TicketNo'] = this.state.UserDetails.Ticket_No;
    secondval1['EngineerAssigned'] = this.state.engineerDetail.Name;
    thirdval1['AssignmentType'] = 'Auto';
    request1 = Object.assign({}, firstval1, secondval1, thirdval1);
    axios
      .put(`http://192.168.0.102:5001/update/webportal/assigned`, {
        data: request1,
      })
      .then(res => {
        console.log(res);
      });
    axios
      .put(`http://192.168.0.102:5001/update/engineerdetail`, {data: request1})
      .then(resp => console.log(resp));
    this.setState({contentScreenNo: 4});
  };

  onClose = () => {
    let request,
      firstval = {},
      secondval = {};
    firstval['from'] = 'Processing';
    secondval['to'] = 'Closed';
    request = Object.assign({}, firstval, secondval);
    axios
      .put(`http://192.168.0.102:5001/update/status`, {data: request})
      .then(response => console.log(response));
    let request1,
      firstval1 = {};
    firstval1['ticketNo'] = this.state.UserDetails.Ticket_No;
    request1 = Object.assign({}, firstval1);
    axios
      .put(`http://192.168.0.102:5001/update/webportal/closed`, {
        data: request1,
      })
      .then(res => {
        console.log(res);
      });
    let request2,
      firstval2 = {},
      secondval2 = {};
    firstval2['TicketNo'] = this.state.UserDetails.Ticket_No;
    secondval2['EngineerAssigned'] = this.state.engineerDetail.Name;
    request2 = Object.assign({}, firstval2, secondval2);
    axios
      .put(`http://192.168.0.102:5001/update/engineerdetail/afterclosed`, {
        data: request2,
      })
      .then(res => {
        console.log(res);
      });

    this.setState({contentScreenNo: 3});
    this.setState({UserDetails: ''});
    Popup.hide();
  };

  onSubmitOTP = () => {
    if (this.state.otp === '4321') {
      let request = {
        OTP: '4321',
      };
      axios
        .post(`http://192.168.0.102:5001/post/otpdetails`, {
          data: request,
        })
        .then(response => {
          console.log('response after otp submit', response);
        });
      let request1,
        firstval1 = {};
      firstval1['ticketNo'] = this.state.UserDetails.Ticket_No;
      request1 = Object.assign({}, firstval1);
      axios
        .put(`http://192.168.0.102:5001/update/webportal/ongoing`, {
          data: request1,
        })
        .then(res => {
          console.log(res);
        });
      this.setState({contentScreenNo: 2});
      this.setState({otp: ''});
    } else {
      alert('Please enter valid OTP');
    }
  };

  onReject = () => {
    this.setState({UserDetails: ''});
    alert('You have rejected');
    this.setState({contentScreenNo: 0});
  };

  onNext = () => {
    this.setState({contentScreenNo: 4});
  };
  render() {
    console.log('Userdetails', this.state.UserDetails);

    return (
      <Root>
        <SafeAreaView style={styles.container}>
          <MapView
            showUserLocation
            style={styles.map}
            initialRegion={{
              latitude: 12.952442,
              longitude: 77.590643,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            {this.state.contentScreenNo === 0 ||
            this.state.contentScreenNo === 1 ||
            this.state.contentScreenNo === 4 ||
            this.state.contentScreenNo === 5 ? (
              <Marker
                //coordinate={this.state}
                draggable={true}
                coordinate={{
                  latitude: 12.972442,
                  longitude: 77.600643,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                onDragEnd={e => {
                  alert(JSON.stringify(e.nativeEvent.coordinate));
                  this.setState({latitude: e.nativeEvent.coordinate.latitude}),
                    this.setState({
                      longitude: e.nativeEvent.coordinate.longitude,
                    });
                }}
                title={'Your location'}>
                <Image
                  source={require('./android/app/src/carimage.png')}
                  style={{height: 40, width: 40}}
                />
              </Marker>
            ) : null}
            {this.state.UserDetails ? (
              <Marker
                coordinate={{
                  latitude: Number(this.state.UserDetails.lattitude) || 0,
                  longitude: Number(this.state.UserDetails.longitude) || 0,
                }}
                draggable={true}
                title={'Customer Location'}></Marker>
            ) : null}
            {this.state.contentScreenNo === 2 ||
            this.state.contentScreenNo === 3 ? (
              <Marker
                //coordinate={this.state}
                draggable={true}
                coordinate={{
                  latitude: Number(this.state.UserDetails.lattitude) || 0,
                  longitude: Number(this.state.UserDetails.longitude) || 0,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                onDragEnd={e => {
                  alert(JSON.stringify(e.nativeEvent.coordinate));
                  this.setState({latitude: e.nativeEvent.coordinate.latitude}),
                    this.setState({
                      longitude: e.nativeEvent.coordinate.longitude,
                    });
                }}
                title={'Your location'}>
                <Image
                  source={require('./android/app/src/carimage.png')}
                  style={{height: 40, width: 40}}
                />
              </Marker>
            ) : null}
          </MapView>

          <View style={styles.content}>
            {this.state.contentScreenNo === 0 ? (
              <View>
                <Text style={styles.topfont}>Welcome</Text>
                {this.state.UserDetails ? (
                  <View>
                    <Text style={styles.contentfont}>
                      Please click to view ticket details
                    </Text>
                    <View style={{margin: 10}}>
                      <Button
                        title="View Ticket Details"
                        onPress={this.getTicketDetails}
                      />
                    </View>
                  </View>
                ) : (
                  <View>
                    <Text style={styles.contentfont}>No tickets to show</Text>
                  </View>
                )}
              </View>
            ) : null}
            {this.state.contentScreenNo === 1 ? (
              <View>
                <Card>
                  <Text>Problem - {this.state.UserDetails.problem}</Text>
                  <Text>Car Number - {this.state.UserDetails.Car_Number} </Text>
                  <Text>
                    Model Number -{this.state.UserDetails.Model_Number}{' '}
                  </Text>
                  <Text>
                    Phone Number -{this.state.UserDetails.Phone_Number}{' '}
                  </Text>
                </Card>

                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1, margin: 10}}>
                    <Button
                      title="Accept"
                      onPress={() =>
                        Popup.show({
                          type: 'Success',
                          title: 'You have Accepted',
                          button: false,
                          textBody: 'Please contact the customer',
                          buttontext: 'Ok',
                          callback: this.onAccept,
                        })
                      }
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      margin: 10,
                    }}>
                    <Button title="Reject" onPress={this.onReject} />
                  </View>
                </View>
              </View>
            ) : null}
            {this.state.contentScreenNo === 2 ? (
              <View>
                <Text style={{textAlign: 'center'}}>
                  Please close the issue once resolved
                </Text>
                <Card>
                  <Text>Problem - {this.state.UserDetails.problem}</Text>
                  <Text>Car Number - {this.state.UserDetails.Car_Number} </Text>
                  <Text>
                    Model Number -{this.state.UserDetails.Model_Number}{' '}
                  </Text>
                  <Text>
                    Phone Number -{this.state.UserDetails.Phone_Number}{' '}
                  </Text>
                </Card>
                <View style={{margin: 5, alignItems: 'center'}}>
                  <Button
                    title="close"
                    onPress={() =>
                      Popup.show({
                        type: 'Success',
                        title: 'Thank You for your service',
                        button: false,
                        buttontext: 'Ok',
                        callback: this.onClose,
                      })
                    }
                  />
                </View>
              </View>
            ) : null}
            {this.state.contentScreenNo === 3 ? (
              <View>
                <AirbnbRating size={20} reviewSize={15} />
                <Text>Please provide your valuable feedback</Text>
                <TextInput style={styles.input} />
                <View style={{alignContent: 'center', margin: 5}}>
                  <Button title="Submit" onPress={this.onSubmit} />
                </View>
              </View>
            ) : null}
            {this.state.contentScreenNo === 4 ? (
              <View>
                <Text>Please enter OTP</Text>
                <TextInput
                  style={styles.input}
                  value={this.state.otp}
                  onChangeText={text => this.setState({otp: text})}
                />
                <View style={{alignContent: 'center', margin: 5}}>
                  <Button title="Submit" onPress={this.onSubmitOTP} />
                </View>
              </View>
            ) : null}
            {this.state.contentScreenNo === 5 ? (
              <View>
                <Card>
                  <Text>Problem - {this.state.UserDetails.problem}</Text>
                  <Text>Car Number - {this.state.UserDetails.Car_Number} </Text>
                  <Text>
                    Model Number -{this.state.UserDetails.Model_Number}{' '}
                  </Text>
                  <Text>
                    Phone Number -{this.state.UserDetails.Phone_Number}{' '}
                  </Text>
                </Card>
                <View style={{alignContent: 'center', margin: 5}}>
                  <Button title="Next" onPress={this.onNext} />
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
            <PushController />
          </View>
        </SafeAreaView>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
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
    top: 380,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  contentfont: {
    fontSize: 18,
    textAlign: 'center',
  },
  topfont: {
    fontSize: 20,
    margin: 5,
    textAlign: 'center',
  },
  input: {
    margin: 5,
    height: 35,
    borderColor: 'grey',
    borderWidth: 1,
  },
});
