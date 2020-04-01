import React, { Component, Fragment } from "react";
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setCurrentChannel } from "../../actions/index";

class Channels extends Component {
  state = {
    activeChannel: "",
    channels: [],
    channelName: "",
    channelDetails: "",
    channelsRef: firebase.database().ref( "channels" ),
    modal: false,
    firstLoad: true
  };

  setActiveChannel = channel => {
    this.setState( { activeChannel: channel.id } );
  };

  changeChannel = channel => {
    this.setActiveChannel( channel );
    this.props.setCurrentChannel( channel );
  };

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    const { firstLoad, channels } = this.state;

    if ( firstLoad && channels.length > 0 )
    {
      this.props.setCurrentChannel( firstChannel );
      this.setActiveChannel( firstChannel );
    }
    this.setState( { firstLoad: false } );
  };

  addListeners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on( "child_added", snap => {
      loadedChannels.push( snap.val() );
      this.setState( { channels: loadedChannels }, () => this.setFirstChannel() );
    } );
  };

  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  removeListeners = () => {
    this.state.channelsRef.off();
  };

  addChannel = () => {
    const { channelsRef, channelName, channelDetails } = this.state;
    const { user } = this.props;

    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL
      }
    };

    channelsRef
      .child( key )
      .update( newChannel )
      .then( () => {
        this.setState( { channelName: "", channelDetails: "" } );
        this.closeModal();
        console.log( "channel added" );
      } )
      .catch( err => {
        console.error( err );
      } );
  };

  isFormValid = ( { channelName, channelDetails } ) =>
    channelName && channelDetails;

  handleSubmit = e => {
    e.preventDefault();
    if ( this.isFormValid( this.state ) )
    {
      this.addChannel();
    }
  };

  handleChange = e => {
    this.setState( { [e.target.name]: e.target.value } );
  };

  closeModal = () => this.setState( { modal: false } );

  openModal = () => this.setState( { modal: true } );

  displayChannels = channels => {
    return (
      channels.length > 0 &&
      channels.map( channel => (
        <Menu.Item
          key={channel.id}
          onClick={() => this.changeChannel( channel )}
          name={channel.name}
          style={{ opacity: 0.7 }}
          active={channel.id === this.state.activeChannel}
        >
          # {channel.name}
        </Menu.Item>
      ) )
    );
  };

  render() {
    const { channels, modal } = this.state;
    return (
      <Fragment>
        <Menu.Menu style={{ paddingBottom: "2em" }}>
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS
            </span>{" "}
            ({channels.length}) <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          {this.displayChannels( channels )}
        </Menu.Menu>

        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label="Name of Channel"
                  name="channelName"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  label="About the Channel"
                  name="channelDetails"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark" /> Add
            </Button>
            <Button color="red" onClick={this.closeModal} inverted>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = ( { user } ) => {
  return {
    user: user.currentUser
  };
};

export default connect( mapStateToProps, { setCurrentChannel } )( Channels );
