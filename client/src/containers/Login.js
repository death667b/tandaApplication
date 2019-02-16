import React, { Component } from "react";
import axios from 'axios';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
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

  handleSubmit = async event => {
    event.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password
    };

    try {
      let userListResponse, formattedShifts;
      const loginResponse = await axios.post(`http://localhost:3000/auth/login`, user);
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': loginResponse.data.sessionId
      }
      const orgListRespoonse = await axios.get(`http://localhost:3000/organisations`, {headers});
      const userInfoResponse = await axios.get(`http://localhost:3000/users/me`, {headers});
      let shiftRes = {data: []};
      if (userInfoResponse.data.organisationId) {
        userListResponse = await axios.get(`http://localhost:3000/users`, {headers});
        shiftRes = await axios.get(`http://localhost:3000/shifts`, {headers});
        const userOrganisation = orgListRespoonse.data[userInfoResponse.data.organisationId-1];
        formattedShifts = await this.props.formatShiftRows(shiftRes.data, userListResponse.data, userOrganisation);
      } else {
        userListResponse = {data: []};
        formattedShifts = [];
      }

      const data = {
        userHasAuthenticated: true,
        sessionId: loginResponse.data.sessionId,
        shifts: formattedShifts,
        rawShifts: shiftRes.data,
        userId: userInfoResponse.data.id,
        users: userListResponse.data,
        name: userInfoResponse.data.name,
        email: userInfoResponse.data.email,
        organisationId: userInfoResponse.data.organisationId,
        organisations: orgListRespoonse.data
      }

      this.props.userHasAuthenticated(data);
      this.props.history.push("/");
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