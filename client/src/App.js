import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem, Button, Modal, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import axios from 'axios';
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    const sessionId = localStorage.getItem('sessionId');
    const autoAuthticate = (
      sessionId !== 'null' && 
      sessionId !== null && 
      sessionId !== 'undefined' &&
      sessionId !== undefined) ? true : false;

    this.state = {
      isAuthenticated: autoAuthticate,
      sessionId: sessionId,
      show: false,
      newEmail: "",
      newName: "",
      oldPassword: "",
      newPassword: "",
      newConfirmPassword: ""
    };
  }

  componentDidMount() {
    if(this.state.isAuthenticated && this.state.sessionId !== 'null' && this.state.sessionId !== 'undefined') {
      const data = {
        userHasAuthenticated: this.state.isAuthenticated,
        sessionId: this.state.sessionId
      }
      this.userHasAuthenticated(data);
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  userHasAuthenticated = (data) => {
    // Get all the details of the user if there is a sessionId
    if (data.userHasAuthenticated && data.sessionId !== 'null' && data.sessionId !== 'undefined') {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': data.sessionId
      }

      try {
        axios.get(`http://localhost:3000/users/me`, {headers})
          .then(res => {
            localStorage.setItem('sessionId', data.sessionId);

            this.setState({ 
              isAuthenticated: data.userHasAuthenticated,
              sessionId: data.sessionId,
              userId: res.data.id,
              name: res.data.name,
              email: res.data.email,
              organisationId: data.organisationId
            });
        }).catch(e => {
          console.log('Axios userHasAuthenticated error: ', e.response.data.error);
        })
      } catch(e) {
          console.log(e)
      }

    } else {
      localStorage.removeItem('sessionId');

      this.setState({ 
        isAuthenticated: false,
        sessionId: null
      });
    }
  }

  handleLogout = async event => {
    const data = {
      userHasAuthenticated: false,
      sessionId: undefined
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': this.state.sessionId
    }

    try {
      await axios.delete(`http://localhost:3000/auth/logout`, {headers, data})
        .then(res => {
          console.log('res', res);

          this.userHasAuthenticated(data);
          this.props.history.push("/login");
        })
    } catch (e) {
      alert(e.message);
    }
  }

  handleModalClose = () => {
    this.setState({ show: false });
  }

  handleModalCancel = () => {
    this.setState({ 
      show: false,      
      newPassword: "",
      newConfirmPassword: "" ,
      newName: "",
      newEmail: ""
    });
  }

  handleModalShow = () => {
    this.setState({ show: true });
  }

  validateModalRenameForm() {
    return (
      this.state.newEmail.length > 0 ||
      this.state.newName.length > 0
    );
  }

  validateModelPasswordForm() {
    return (
      this.state.oldPassword.length > 0 &&
      this.state.newPassword.length > 0 &&
      this.state.newPassword === this.state.newConfirmPassword
    );
  }

  handleModalRenameSubmit = async event => {
    event.preventDefault();

    const updateUser = {
      name: this.state.newName || this.state.name,
      email: this.state.newEmail || this.state.email
    };

    console.log(updateUser);

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': this.state.sessionId
    }

    try {
      await axios.put(`http://localhost:3000/users/me`, updateUser, {headers})
        .then(res => {
          alert('User successfully updated!');

          this.setState({ 
            name: res.data.name,
            email: res.data.email,
            show: false
          });
        })
    } catch (e) {
      alert(e.response.data.error);
    }
  }

  handleModalPasswordSubmit = async event => {
    event.preventDefault();

    const updatePassword = {
      oldPassword: this.state.oldPassword,
      newPassword: this.state.newPassword,
      newPasswordConfirmation: this.state.newConfirmPassword
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': this.state.sessionId
    }

    try {
      await axios.put(`http://localhost:3000/users/me/change_password`, updatePassword, {headers})
        .then(res => {
          alert('New password successfully saved!');

          this.setState({ 
            oldPassword: "",
            newPassword: "",
            newConfirmPassword: "",
            show: false
          });
        })
    } catch (e) {
      alert(e.response.data.error);
    }
  }

render() {
  const childProps = {
    isAuthenticated: this.state.isAuthenticated,
    sessionId: this.state.sessionId,
    userHasAuthenticated: this.userHasAuthenticated,
    userId: this.state.userId,
    name: this.state.name,
    email: this.state.email,
    organisationId: this.state.organisationId
  };

  return (
    <div className="App container">
      <Navbar fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">Adnat</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            {this.state.isAuthenticated
              ? <Fragment>
                  <NavItem onClick={this.handleModalShow}>Edit Profile</NavItem>
                  <NavItem onClick={this.handleLogout}>Logout</NavItem>
                </Fragment>
              : <Fragment>
                  <LinkContainer to="/signup">
                    <NavItem>Signup</NavItem>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <NavItem>Login</NavItem>
                  </LinkContainer>
                </Fragment>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      
      <Routes childProps={childProps} />


      <Modal show={this.state.show} onHide={this.handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editing Details for {this.state.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={this.handleModalRenameSubmit}>
            <FormGroup controlId="newName" bsSize="large">
              <ControlLabel>Name</ControlLabel>
              <FormControl
                autoFocus
                type="name"
                value={this.state.newName || this.state.name}
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup controlId="newEmail" bsSize="large">
              <ControlLabel>Email</ControlLabel>
              <FormControl
                autoFocus
                type="email"
                value={this.state.newEmail || this.state.email}
                onChange={this.handleChange}
              />
            </FormGroup>
            <Button
              block
              bsSize="large"
              disabled={!this.validateModalRenameForm()}
              type="submit"
            >
              Save new details
            </Button>
          </form>
          <form onSubmit={this.handleModalPasswordSubmit}>
            <FormGroup controlId="oldPassword" bsSize="large">
              <ControlLabel>Old Password</ControlLabel>
              <FormControl
                value={this.state.oldPassword}
                onChange={this.handleChange}
                type="password"
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
            <FormGroup controlId="newConfirmPassword" bsSize="large">
              <ControlLabel>Confirm New Password</ControlLabel>
              <FormControl
                value={this.state.newConfirmPassword}
                onChange={this.handleChange}
                type="password"
              />
            </FormGroup>
            <Button
              block
              bsSize="large"
              disabled={!this.validateModelPasswordForm()}
              type="submit"
            >
              Save new password
            </Button>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleModalCancel}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>


    </div>
  );
}
}

export default withRouter(App);