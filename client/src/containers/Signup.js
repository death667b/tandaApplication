import React, { Component } from "react";
import { FormGroup, FormControl, Checkbox, ControlLabel, Button } from "react-bootstrap";
import axios from 'axios';
import "./Signup.css";

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      savePasswordChecked: true
    };
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
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

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      passwordConfirmation: this.state.confirmPassword
    };

    try {
      const newUserRes = await axios.post(`http://localhost:3000/auth/signup`, newUser)
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': newUserRes.data.sessionId
      }
      const orgListRespoonse = await axios.get(`http://localhost:3000/organisations`, {headers});
      const userInfoResponse = await axios.get(`http://localhost:3000/users/me`, {headers});
      const allUsersResponse = await axios.get(`http://localhost:3000/users/all`, {headers});

      const data = {
        userHasAuthenticated: true,
        sessionId: newUserRes.data.sessionId,
        shifts: [],
        rawShifts: [],
        userId: userInfoResponse.data.id,
        users: [],
        allUsers: allUsersResponse.data,
        name: userInfoResponse.data.name,
        email: userInfoResponse.data.email,
        organisationId: userInfoResponse.data.organisationId,
        organisations: orgListRespoonse.data,
        savePasswordChecked: this.state.savePasswordChecked
      }

      alert('New user successfully created!');
      this.props.userHasAuthenticated(data);
      this.props.history.push("/");
      
    } catch (e) {
      alert(e.response.data.error);
    }
  }

  render() {
    return (
      <div className="Signup">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="name" bsSize="large">
            <ControlLabel>Name</ControlLabel>
            <FormControl
              autoFocus
              type="name"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </FormGroup>
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
          <FormGroup controlId="confirmPassword" bsSize="large">
            <ControlLabel>Confirm Password</ControlLabel>
            <FormControl
              value={this.state.confirmPassword}
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
            </FormGroup>
          </div>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Signup
          </Button>
        </form>
      </div>
    );
  }
}