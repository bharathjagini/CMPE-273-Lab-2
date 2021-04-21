import cookie from "react-cookies";
import React, { Component } from "react";
import splitwisewithoutname from "../../assets/images/splitwisewithoutname.svg";
import "./Signup.css";
import axios from "axios";
import { connect } from "react-redux";
import { signup } from "../../redux/actions/index";
import config from '../../config.json';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      custName: "",
      custEmail: "",
      custPasswd: "",
      custId: "",
      imagePath:"",
      signUpDone: false,
      token:""
    };
  }
  custNameChanged = e => {
    const name = e.target.value;
    this.setState({
      custName: name
    });
  };
  custEmailChanged = e => {
    const email = e.target.value;
    this.setState({
      custEmail: email
    });
  };
  custPasswordChanged = e => {
    const passwd = e.target.value;
    this.setState({
      custPasswd: passwd
    });
  };
  signUp = e => {
    var headers = new Headers();
    e.preventDefault();
    const signupDetails = {
      custName: this.state.custName,
      custEmail: this.state.custEmail,
      custPassword: this.state.custPasswd
    };
    axios.defaults.withCredentials = true;
    axios
      .post(config.backEndURL+"/users/signup", signupDetails)
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 201) {
          console.log(response);
          const custDetails={
             custId: response.data._id,
            custName: response.data.custName,
            custEmail:response.data.custEmail,
            loginUserId:response.data.custEmail,
            timezoneId:response.data.timeZoneId,
            currencyId:response.data.currencyId,
            languageId:response.data.languageId,
          phnNumber:response.data.custPhoneNumber,
           currencyValue:"",
           countryCode:"",
           image:"",
           token:response.data.token
          }
          this.props.signup({custDetails});
          sessionStorage.setItem("custDetails", JSON.stringify(custDetails));
          this.setState({
            signUpDone: true,
            custId: response.data._id,
            token:response.data.token
          });
        } else {
          this.setState({
            signUpDone: false
          });
        }
      })
      .catch(error => {
        console.log(error.response);
        this.setState({
          signUpDone: false,
          errorMsg: error.response.data.errorDesc
        });
      });
  };

  render() {
   if (this.state.token.length>0) {
      sessionStorage.setItem("token",this.state.token);
      this.props.history.push("/home", {
        loginUserId: this.state.custEmail,
        custId: this.state.custId,
        custName: this.state.custName
      });
    }
    let emailAndPasswd = null;
    if (this.state.custName.length > 0) {
      emailAndPasswd = (
        <div className="signup-email-passwd">
          Here's my <strong>email address</strong>
          <input
            type="email"
            name="custEmail"
            placeholder="Email"
            className="signup-email"
            onChange={this.custEmailChanged}
          ></input>
          Here's my <strong>password</strong>
          <input
            type="password"
            name="custPasswd"
            placeholder="Password"
            onChange={this.custPasswordChanged}
          ></input>
          <button className="signup-btn" type="submit">
            Sign me up
          </button>
        </div>
      );
    }
    return (
      <div className="main-container">
        <form onSubmit={this.signUp}>
          <div className="signup-header"></div>
          <div className="signup-container">
            <img
              height="200"
              width="200"
              className="signup-img"
              alt="splitwise"
              src={splitwisewithoutname}
            />
            <div className="signup-content">
              <h2>Introduce Yourself</h2>
              <div className="signup-name-label">Hi there! My name is</div>

              <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={this.custNameChanged}
              />
              {emailAndPasswd}
            </div>
          </div>
        </form>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    signup: signupDetails => dispatch(signup(signupDetails))
  };
}
const signupd = connect(
  null,
  mapDispatchToProps
)(Signup);
export default signupd;
//export default Signup;
