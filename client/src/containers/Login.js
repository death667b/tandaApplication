import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { Button, FormGroup, Checkbox, FormControl, ControlLabel } from "react-bootstrap";
import refreshUserData from '../util/refreshUserData.js';
import "./Login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      savePasswordChecked: true,
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleCheckBoxChange = event => {
    const newStatus = (this.state.savePasswordChecked) ? false : true;
    this.setState({
      savePasswordChecked: newStatus
    })
  }

  handleSubmit = async event => {
    event.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password
    };

    try {
      const loginResponse = await axios.post(`http://localhost:3000/auth/login`, user);
      
      refreshUserData(loginResponse.data.sessionId)
        .then(data => {
          const { savePasswordChecked } = this.state;
          this.props.userHasAuthenticated({savePasswordChecked, ...data});
          this.props.history.push("/");
        })
    } catch (e) {
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
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <div className="small">
            <FormGroup controlId="savePasswordChecked">
              <Checkbox 
                type="checkbox"
                checked={this.state.savePasswordChecked}
                onChange={this.handleCheckBoxChange}
              >Save Password</Checkbox>
              <Link to="/forgotpassword">Reset Pasword</Link>
            </FormGroup>
          </div>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Login
          </Button>
        </form>
      </div>
    );
  }
}