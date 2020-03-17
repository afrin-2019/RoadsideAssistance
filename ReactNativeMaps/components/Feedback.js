import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Button} from 'react-native';
import {Rating, AirbnbRating} from 'react-native-ratings';

class Feedback extends Component {
  state = {};

  onSubmit = () => {
    this.props.onSubmit();
  };

  render() {
    return (
      <View>
        <Text style={{textAlign: 'center'}}>Your Bill</Text>

        <Text style={{textAlign: 'center', fontSize: 22, fontWeight: 'bold'}}>
          Rs.500
        </Text>

        <AirbnbRating size={20} reviewSize={15} />

        {/* <View
          style={{
            borderBottomColor: 'grey',
            borderBottomWidth: 1,
            marginLeft: 2,
            marginRight: 2,
            marginBottom: 5,
          }}
        /> */}
        <Text>Please provide your valuable feedback</Text>
        <TextInput style={styles.input} />
        <View style={{alignContent: 'center', margin: 5}}>
          <Button title="Submit" onPress={this.onSubmit} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    margin: 5,
    height: 35,
    borderColor: 'grey',
    borderWidth: 1,
  },
});

export default Feedback;
