import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Router from './Router';

export default class App extends Component {
  render() {
    return (
      <View style={styles.app}>
        <Router />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: "#222"
  }
});
