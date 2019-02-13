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
      <div className="main">
        <h1>main page</h1>
        <p>A simple roster app</p>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated === false
          ? this.renderWelcomePage()
          : this.renderMainPage()}
      </div>
    );
  }
}