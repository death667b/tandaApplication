import React, { Component } from "react";
import axios from 'axios';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./ForgotPassword.css";

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      newPassword: "",
      confirmNewPassword: "",
    };
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.newPassword.length > 0 &&
      this.state.newPassword === this.state.confirmNewPassword
    );
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

  const resetPassword = {
    email: this.state.email,
    newPassword: this.state.newPassword,
    newPasswordConfirmation: this.state.confirmNewPassword
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': this.state.sessionId
    }    

    try {
      await axios.put(`http://localhost:3000/users/me/reset_password`, resetPassword, {headers});
      alert('Password Reset');
      this.props.history.push("/login");
    } catch (e) {
      console.log(e.response.data)
      alert(e.response.data.error);
    }
  }

  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="newPassword" bsSize="large">
            <ControlLabel>New Password</ControlLabel>
            <FormControl
              value={this.state.newPassword}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <FormGroup controlId="confirmNewPassword" bsSize="large">
            <ControlLabel>Confirm New Password</ControlLabel>
            <FormControl
              value={this.state.confirmNewPassword}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            block
            bsStyle="danger"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Reset
          </Button>
        </form>
      </div>
    );
  }
}