import React, { Component, Fragment } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import firebase from "../../firebase";

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref("messages")
  };

  render() {
    const { messagesRef } = this.state;
    return (
      <Fragment>
        <MessagesHeader />

        <Segment>
          <Comment.Group className="messages">Messages</Comment.Group>
        </Segment>
        <MessageForm messagesRef={messagesRef} />
      </Fragment>
    );
  }
}

export default Messages;
