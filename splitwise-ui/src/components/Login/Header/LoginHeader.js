import React, { Component } from "react";
import splitwisewhite from "../../../assets/images/splitwisewhite.svg";
import { Link } from "react-router-dom";
import "./LoginHeader.css";
class LoginHeader extends Component {
  constructor(props) {
    super(props);
  }
  signup = () => {
    this.props.history.push("/signup");
  };
  render() {
    return (
      <div className="header">
        <div className="login-header">
             <Link to="/">
          <img src={splitwisewhite} alt="Splitwisetext" style={{cursor:'pointer'}} />
          </Link>
          <div className="loginLinks">
           <Link to="/login">
            <button className="login">Log in</button>
            </Link>
            <span style={{ color: "white" }}>or</span>
            <Link to="/Signup">
              <button className="signup">Sign up</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
export default LoginHeader;
