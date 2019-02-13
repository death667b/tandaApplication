import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Routes from "./Routes";
import axios from 'axios';
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      sessionId: null,
    };
  }

  userHasAuthenticated = (data) => {
    console.log(data);

    this.setState({ 
      isAuthenticated: data.userHasAuthenticated,
      sessionId: data.sessionId
     });
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

render() {
  const childProps = {
    isAuthenticated: this.state.isAuthenticated,
    sessionId: this.state.sessionId,
    userHasAuthenticated: this.userHasAuthenticated
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
              ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
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
    </div>
  );
}
}

export default withRouter(App);