import React, { Component } from "react";
import { Grid, Header, Icon, Dropdown, Image } from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";

class UserPanel extends Component {
  dropdownOptions = () => {
    const { currentUser } = this.props;
    return [
      {
        key: "user",
        text: (
          <span>
            Signed in as <strong>{currentUser.displayName}</strong>
          </span>
        ),
        disabled: true
      },
      {
        key: "avatar",
        text: <span>Change Avatar</span>
      },
      {
        key: "signout",
        text: <span onClick={this.handleSignout}>Sign Out</span>
      }
    ];
  };

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("User loged out!");
      });
  };

  render() {
    console.log(this.props.currentUser);
    const { currentUser } = this.props;
    return (
      <Grid style={{ backround: "#4c3c4c" }}>
        <Grid.Column>
          <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
            <Header inverted floated="left" as="h2">
              <Icon name="code" />
              <Header.Content>DevChat</Header.Content>
            </Header>
            <Header style={{ padding: "0.25em" }} as="h4" inverted>
              <Dropdown
                trigger={
                  <span>
                    <Image src={currentUser.photoURL} spaced="right" avatar />
                    {currentUser.displayName}
                  </span>
                }
                options={this.dropdownOptions()}
              />
            </Header>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = ({ user }) => {
  return {
    currentUser: user.currentUser
  };
};

export default connect(mapStateToProps)(UserPanel);
