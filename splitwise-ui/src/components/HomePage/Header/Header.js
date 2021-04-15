import React, { Component } from "react";
import splitwisewhite from "../../../assets/images/splitwisewhite.svg";
import "./Header.css";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import config from '../../../config.json';
import cookie from "react-cookies";
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
 custDetails:this.props.custDetails,
	    loggedIn: this.props.loggedIn
    };
  }
  logout = () => {
    console.log("inside logout");
    this.props.logOut(!this.state.loggedIn);
    // this.setState({
    //   loggedIn: false
    // });
  };
  render() {
    console.log("qwer");
    // if (!this.state.loggedIn) {
    //   cookie.remove("cookie");
    //   console.log("logged out");
    //   this.props.history.push("/");
    // }
    //console.log(cookie.load("cookie"));
    //  console.log(this.props);
    // if (!cookie.load("cookie")) this.props.history.push("/");
    return (
      <div className="header">
        <div className="login-header">
          <img src={splitwisewhite} alt="Splitwisetext" />
          <div className="loginLinks">
	      <span style={{color:'black'}}> {this.state.custDetails.custName}</span>
            <button className="login" onClick={this.logout}>
              Log out
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;

{
  /* <div className="home-header">
          <img src={splitwisewhite} alt="Splitwisetext" />
          <div className="loginLinks">
            <button className="login">Log in</button>
            <span style={{ color: "white" }}>or</span>
            <button className="signup">Sign up</button>
          </div>
        </div> */
}
