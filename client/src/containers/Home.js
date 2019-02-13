import React, { Component } from "react";

import "./Home.css";

export default class Home extends Component {
  renderWelcomePage() {
    return (
      <div className="lander">
        <h1>Adnat</h1>
        <p>A simple roster app</p>
      </div>
    );
  }

  renderMainPage() {
    return (
      <div className="Main">
        <h1>Welcome {this.props.name}</h1>
        <p className="small">Your user number {this.props.userId} and your email address is {this.props.email}</p>
        
      </div>
    );
  }

  render() {
    console.log(this.props)
    return (
      <div className="Home">
        {this.props.isAuthenticated === false
          ? this.renderWelcomePage()
          : this.renderMainPage()}
      </div>
    );
  }
}