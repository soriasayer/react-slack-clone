import React, { Component } from "react";
import { Segment, Input, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import firebase from "../../firebase";

class MessageForm extends Component {
  state = {
    message: "",
    loading: false,
    errors: []
  };

  handleChange = e => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  createMessage = () => {
    const { user } = this.props;
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL
      },
      content: this.state.message
    };
    return message;
  };

  sendMessage = () => {
    const { messagesRef, channel } = this.props;
    const { message, errors } = this.state;

    if (message) {
      this.setState({ loading: true });
      messagesRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: "", errors: [] });
        })
        .catch(err => {
          console.error(err);
          this.setState({ loading: false, errors: errors.concat(err) });
        });
    } else {
      this.setState({ errors: errors.concat({ message: "Add a message" }) });
    }
  };

  render() {
    console.log(this.props.channel && this.props.channel.id);
    console.log(this.props.user.uid);
    const { errors } = this.state;
    return (
      <Segment className="message--form">
        <Input
          fluid
          name="message"
          onChange={this.handleChange}
          style={{ marginBottom: "0.7em" }}
          label={<Button icon={"add"} />}
          labelPosition="left"
          className={
            errors.some(error => error.message.includes("message"))
              ? "error"
              : ""
          }
          placeholder="Write your message"
        />
        <Button.Group icon widths="2">
          <Button
            onClick={this.sendMessage}
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
          />
          <Button
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
        </Button.Group>
      </Segment>
    );
  }
}

const mapStateToProps = ({ user, channel }) => {
  return {
    user: user.currentUser,
    channel: channel.currentChannel
  };
};

export default connect(mapStateToProps)(MessageForm);
