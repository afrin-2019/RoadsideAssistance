import React, {Component} from 'react';
import PushNotification from 'react-native-push-notification';

class PushController extends Component {
  state = {};

  componentDidMount() {
    PushNotification.configure({
      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
        console.log('LOCAL NOTIFICATION ==>', notification);
      },
    });
  }
  render() {
    return null;
  }
}

export default PushController;
