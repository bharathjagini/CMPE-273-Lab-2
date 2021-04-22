import React, { Component } from "react";
import DashboardHeader from "./DashboardHeader/DashboardHeader";
import DashboardExpSummary from "./DashboardExpSummary/DashboardExpSummary";
import DashboardOweHeader from "./DashboardOweHeader/DashboardOweHeader";
import axios from 'axios';
import config from '../../config.json';
import cookie from "react-cookies";
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      custDetails:this.props.custDetails,
      oweDetails:{
        loggedInCustOweAmount:0,
        loggedInCustPaidAmount:0,
        allGrpMemOweList:[],
        eachCustOweList:[]
      },
      isDataLoaded:false
    };
  }

  componentDidMount()
  {
    this.fetchDashboardDtls();
  }

  componentDidUpdate(prevProps)
  {
    if(prevProps.custDetails!==this.props.custDetails)
    {
      const changedCustDetails=this.props.custDetails;
      this.setState({
        custDetails:changedCustDetails
      })
    }
  }
  
  fetchDashboardDtls=()=>{
    axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
axios
      .get(
        config.backEndURL+"/users/dashboardDtls/" +
          this.state.custDetails.custId
      )
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          console.log(response.data);
          const oweDetails=response.data;
          // oweDetails.eachCustOweList=response.data.eachCustOweList;
          // oweDetails.allGrpMemOweList=response.data.allGrpMemOweList;
          // oweDetails.loggedInCustOweAmount=response.data.loggedInCustOweAmount;
          // oweDetails.loggedInCustPaidAmount=response.data.loggedInCustPaidAmount;
          this.setState({
            oweDetails: oweDetails,
            isDataLoaded:true
          });
          // console.log(this.state.userGroupDetailsList);
        }
      })
      .catch(error => {
        console.log(error.response);
        // this.setState({
        //   signUpDone: false,
        //   errorMsg: error.response.data.errorDesc
      });
  }
  settleUp=()=>{
    console.log('in settle up')
this.fetchDashboardDtls();
  }
  render() {
    return (
      <div className="dashboard">
        <section>
          <div className="center-divider">
            <DashboardHeader  custDetails={this.state.custDetails} oweDetails={this.state.oweDetails} isDataLoaded={this.state.isDataLoaded}
              settleUp={this.settleUp}
            />
            {this.state.isDataLoaded ? <DashboardExpSummary custDetails={this.state.custDetails} oweDetails={this.state.oweDetails}/>: 'loading'}
            {/* <div className="grid-container-owe">
              <DashboardOweHeader />
            </div> */}
          </div>
        </section>
      </div>
    );
  }
}
export default Dashboard;
