import React, { Component } from "react";
import { Link } from "react-router-dom";
//import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import "./Header.css";
import splitwise from "../../../assets/images/splitwise.svg";
class Header extends Component {
  constructor(props) {
    super(props);
  }
  redirect = () => {
    console.log(this.props);
    this.props.history.push("/signup");
  };
  render() {
    console.log(this.props);
    return (
      <div className="dummy">
        <AppBar position="static" style={{ color: "#FFFFFF" }}>
          <Toolbar className="toolbar">
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              <img src={splitwise} alt="Spliwise" />
            </Typography>
            <Link to="/login" className="login">
              Login
            </Link>
            <Link to="/Signup">
              <Button className="MuiButtonBase-root">SignUp</Button>
            </Link>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
export default Header;
