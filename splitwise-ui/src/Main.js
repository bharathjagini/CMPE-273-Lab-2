import React, { Component } from "react";
import { Route } from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import HomePage from "./components/HomePage/HomePage";
import RecentActivity from "./components/RecentActivity/RecentActivity";
import LandingPageRoutes from "./components/HomePage/LandingPageRoutes";
import CreateGroup from "./components/Group/CreateGroup/CreateGroup";
import MyProfile from "./components/MyProfile/MyProfile";

class Main extends Component {
  render() {
    return (
      <div>
        {/*Render Different Component based on Route*/}
        <Route path="/" component={LandingPage} exact />
        <Route path="/Signup" component={Signup} exact />
        <Route path="/login" component={Login} exact />
        <Route path="/home" component={HomePage} exact />
        
        

      </div>
    );
  }
}
export default Main;
