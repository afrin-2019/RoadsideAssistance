import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  KeyboardAvoidingView,
} from 'react-native';

export default class CarDetails extends Component {
  state = {
    car_no: this.props.cardetails.CarNo,
    model_no: '504a',
    phone_no: this.props.cardetails.PhNo,
  };
  render() {
    console.log(
      'car no ',
      this.state.car_no + 'model no ',
      this.state.model_no,
    );
    return (
      <View>
        <Text>Please provide the following details</Text>

        <Text style={styles.label}>Car Number</Text>
        <TextInput
          style={styles.input}
          value={this.state.car_no}
          onChangeText={text => this.setState({car_no: text})}
        />

        {/* <View style={{flexDirection: 'row'}}>
          <Text>Model Number</Text>
          <TextInput
            style={styles.input}
            //placeholder="Model No"
            value={this.state.model_no}
            onChangeText={text => this.setState({model_no: text})}
          />
        </View> */}

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={this.state.phone_no}
          onChangeText={text => this.setState({phone_no: text})}
        />

        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 1, margin: 10}}>
            <Button title="Back" onPress={this.props.onclickyes} />
          </View>
          <View
            style={{
              flex: 1,
              margin: 10,
            }}>
            <Button
              title="Next"
              onPress={() =>
                this.props.onclicknext(
                  this.state.car_no,
                  this.state.model_no,
                  this.state.phone_no,
                )
              }
            />
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  input: {
    margin: 3,
    height: 35,
    borderColor: 'grey',
    borderWidth: 1,
  },
  label: {
    fontWeight: 'bold',
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
