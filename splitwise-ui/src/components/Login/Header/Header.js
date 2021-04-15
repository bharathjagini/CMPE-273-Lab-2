import React, { Component } from "react";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import "./Header.css";
import splitwisewhite from "../../../assets/images/splitwisewhite.svg";

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="dummy">
        <AppBar position="static" style={{ color: "#FFFFFF" }}>
          <Toolbar className="toolbar">
            <Typography style={{ flexGrow: 1 }}>
              <img src={splitwisewhite} alt="Spliwise" />
            </Typography>
            <Button className="login">Login</Button>
            <Button className="MuiButtonBase-root">SignUp</Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
export default Header;
