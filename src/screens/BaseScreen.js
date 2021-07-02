import React from "react";
import autobind, { boundMethod } from "autobind-decorator";
import { firebaseEmitter } from "../FirebaseMessagingManager";

export class BaseScreen extends React.Component {

  @autobind
  params(): Object {
    return this.props.route?.params;
  }

  @boundMethod
  componentDidMount() {
    // Firebase
    firebaseEmitter.on('onMessage', this.onMessage);
  }

  @boundMethod
  componentWillUnmount() {
    // Firebase
    firebaseEmitter.off('onMessage', this.onMessage);
  }

  @boundMethod
  onMessage(message) {
    console.log('BaseComponent:onMessage()', message);
  }
}