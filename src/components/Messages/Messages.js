import React, { Component, Fragment } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./MessagesHeader";
import MessageForm from "./MessageForm";
import firebase from "../../firebase";
import { connect } from "react-redux";
import Message from "./Message";

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref("messages"),
    messages: [],
    messagesLoading: true
  };

  componentDidMount() {
    const { user, channel } = this.props;
    if (user && channel) {
      this.addListeners(channel.id);
    }
  }

  addListeners = channelId => {
    let loadedMessages = [];
    this.state.messagesRef.child(channelId).on("child_added", snap => {
      loadedMessages.push(snap.val());
      this.setState({ messages: loadedMessages, messagesLoading: false });
    });
  };

  displayMessages = messages => {
    return (
      messages.length > 0 &&
      messages.map(message => (
        <Message
          key={message.timestamp}
          message={message}
          user={this.props.user}
        />
      ))
    );
  };

  render() {
    const { messagesRef, messages } = this.state;

    return (
      <Fragment>
        <MessagesHeader />

        <Segment>
          <Comment.Group className="messages">Messages</Comment.Group>
          {this.displayMessages(messages)}
        </Segment>
        <MessageForm messagesRef={messagesRef} />
      </Fragment>
    );
  }
}

const mapStateToProps = ({ user, channel }) => {
  return {
    user: user.currentUser,
    channel: channel.currentChannel
  };
};

export default connect(mapStateToProps)(Messages);
