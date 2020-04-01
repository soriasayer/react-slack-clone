import React, { Component } from "react";
import firebase from "../../firebase";
import md5 from "md5";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";

class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading: false,
    usersRef: firebase.database().ref( "users" )
  };

  isFormEmpty = ( { username, email, password, passwordConfirmation } ) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  isPasswordValid = ( { password, passwordConfirmation } ) => {
    if ( password.length < 6 || passwordConfirmation.length < 6 )
    {
      return false;
    } else if ( password !== passwordConfirmation )
    {
      return false;
    } else
    {
      return true;
    }
  };

  isFormValid = () => {
    let errors = [];
    let error;

    if ( this.isFormEmpty( this.state ) )
    {
      error = { message: "Fill in all fields" };
      this.setState( { errors: errors.concat( error ) } );
      return false;
    } else if ( !this.isPasswordValid( this.state ) )
    {
      error = { message: "Password is invalid" };
      this.setState( { errors: errors.concat( error ) } );
      return false;
    } else
    {
      return true;
    }
  };

  displayError = errors =>
    errors.map( ( error, i ) => <p key={i}>{error.message}</p> );

  handleChange = e => {
    this.setState( { [e.target.name]: e.target.value } );
  };

  saveUser = createdUser => {
    return this.state.usersRef.child( createdUser.user.uid ).set( {
      name: createdUser.user.displayName,
      avatar: createdUser.user.photoURL
    } );
  };

  handleSubmit = e => {
    const { username, email, password, errors } = this.state;

    e.preventDefault();

    if ( this.isFormValid() )
    {
      this.setState( { errors: [], loading: true } );
      firebase
        .auth()
        .createUserWithEmailAndPassword( email, password )
        .then( createdUser => {
          console.log( createdUser );
          createdUser.user
            .updateProfile( {
              displayName: username,
              photoURL: `http://gravatar.com/avatar/${ md5(
                createdUser.user.email
              ) }?d=identicon`
            } )
            .then( () => {
              this.saveUser( createdUser ).then( () => {
                console.log( "user saved" );
              } );
            } )
            .catch( err => {
              console.log( err );
              this.setState( { errors: errors.concat( err ), loading: false } );
            } );
        } )
        .catch( err => {
          console.log( err );
          this.setState( { errors: errors.concat( err ), loading: false } );
        } );
    }
  };

  handleInputError = ( errors, inputName ) => {
    return errors.some( error => error.message.toLowerCase().includes( inputName ) )
      ? "error"
      : "";
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading
    } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register for DevChat
          </Header>
          <Form onSubmit={this.handleSubmit} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="mail"
                iconPosition="left"
                placeholder="Username"
                onChange={this.handleChange}
                value={username}
                type="text"
                className={this.handleInputError( errors, "username" )}
              />
              <Form.Input
                fluid
                name="email"
                icon="user"
                iconPosition="left"
                placeholder="Email Address"
                onChange={this.handleChange}
                value={email}
                type="email"
                className={this.handleInputError( errors, "email" )}
              />
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                value={password}
                type="password"
                className={this.handleInputError( errors, "password" )}
              />
              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password Confirmation"
                onChange={this.handleChange}
                value={passwordConfirmation}
                type="password"
                className={this.handleInputError( errors, "password" )}
              />
              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                color="orange"
                fluid
                size="large"
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayError( errors )}
            </Message>
          )}
          <Message>
            Already a user? <Link to="/Login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
