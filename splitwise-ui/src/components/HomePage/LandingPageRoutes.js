import React, { Component } from "react";
import { Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

import HomePage from "./HomePage";
import RecentActivity from "../RecentActivity/RecentActivity";
class LandingPageRoutes extends Component {
  render() {
    console.log("asdf");
    return <div></div>;
    // <BrowserRouter>
    //   <div>
    //     {/*Render Different Component based on Route*/}

    //<Route path="/home" component={HomePage} exact />;
    //     {/* <Route path="/recentactivity" component={RecentActivity} exact /> */}
    //   </div>
    // </BrowserRouter>
  }
}
export default LandingPageRoutes;
