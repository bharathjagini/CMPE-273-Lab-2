import React, { Component } from "react";
import Header from "./Header/Header";
import "./LandingPage.css";
import LoginHeader from "../Login/Header/LoginHeader";
import splitwisewithoutname from "../../assets/images/splitwiselanding.jpg";
class LandingPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
    return (
    <div>
      <LoginHeader />   
   <div className="landingContent">
     <h1>Less Stress When Sharing</h1><h1>Expenses</h1><h1 style={{color:'#1CC29F'}}>on trips</h1>
     </div>
     <div className="content">

 <img
              height="450"
              width="450"
              className="landingImage"
              alt="splitwise"
              src={splitwisewithoutname}
            />
               
     </div>
   </div>   
      );
  }
}
export default LandingPage;
