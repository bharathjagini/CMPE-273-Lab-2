import React, { Component } from "react";
import Header from "./Header/Header";
import "./HomePage.css";
import { Link,Route } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";
import LeftSideBar from "./LeftSideBar/LeftSideBar";
import RecentActivity from "../RecentActivity/RecentActivity";
import CreateGroup from "../Group/CreateGroup/CreateGroup";
import { Switch } from "@material-ui/core";
import { Redirect } from "react-router";
import cookie from "react-cookies";
import { connect } from "react-redux";

import { reset,updateCustDetails,updateUserGrpList,saveProfDtls } from "../../redux/actions/index";
import { BrowserRouter, HashRouter } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import MyGroup from "../Group/MyGroup/MyGroup";
import GroupExpenses from "../GroupExpenses/GroupExpenses";
import AllExpenses from "../AllExpenses/AllExpenses";
import MyProfile from "../MyProfile/MyProfile";
import config from '../../config.json';
class HomePage extends Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      loggedIn: true,
      //custDetails: this.props.location.custDetails,
        custDetails: {},
      selectedGrpDtls:{},
      userGroupDetailsList:[],
      newGroup:{},
      profDtls:{
        currencyDtlsList:[],
         langDetailsList:[],
        timezoneDetailsList:[]
      }
      // custDetails: {
      //   loggedInUserId: this.props.location.loginUserId,
      //   custId: this.props.custId,
      //   custName: this.props.custName
      // }
    };
  }
  logOut = loggedin => {
    console.log("logged in", loggedin);
    console.log(this.state.loggedIn);
    this.setState({
      loggedIn: loggedin
    });
  
  };
  componentWillMount() {
    console.log('will mount')
   const custDetails = JSON.parse(sessionStorage.getItem("custDetails"));
    this.setState({
      custDetails:custDetails
    });
    if(sessionStorage.getItem("userGroupDetailsList")!==null){
    const userGroupDetailsList=JSON.parse(sessionStorage.getItem("userGroupDetailsList"));
    this.setState({
      userGroupDetailsList:userGroupDetailsList
    })
  }
   
  }

  getGroupsForCust=()=>{
    axios.defaults.withCredentials = true;
      axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
      console.log('in groups',sessionStorage.getItem('token'));
axios
      .get(
        config.backEndURL+"/users/custGroup/" +
          this.state.custDetails.custId
      )
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          console.log(response);
          //if(response.data.length>0){
          this.setState({
            userGroupDetailsList: response.data
          });
          const userGroupDetailsList=response.data;
          console.log('userGroupDetailsList',userGroupDetailsList)
          this.props.updateUserGroupDetailsList({userGroupDetailsList})
          sessionStorage.setItem("userGroupDetailsList",JSON.stringify(response.data));
          // console.log(this.state.userGroupDetailsList);
    //    }
      }
      })
      .catch(error => {
        console.log(error.response);
        // this.setState({
        //   signUpDone: false,
        //   errorMsg: error.response.data.errorDesc
      });
  }
 async  componentDidMount() {
   await this.getGroupsForCust();
    this.getUserCurrency();
 
    const custDetails=JSON.parse(sessionStorage.getItem("custDetails"));
    if(custDetails!=null)
    this.setState({
      custDetails:custDetails
    })
    const userGroupDetailsList=JSON.parse(sessionStorage.getItem("userGroupDetailsList"));
    if(userGroupDetailsList!==null)
     this.setState({
      userGroupDetailsList:userGroupDetailsList
    })
  }
getUserCurrency=()=>{
  axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
  axios
      .get(
        config.backEndURL+"/users/currency/" +
         this.state.custDetails.currencyId
      )
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          console.log(response.data);
          const custDetails=this.state.custDetails;
          custDetails.currencyValue=response.data;
          this.setState({
            custDetails: custDetails
          });
         this.props.updateCustDetails({custDetails});
          sessionStorage.setItem("custDetails",JSON.stringify(custDetails))
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
  newGroupCreated=(updatedGrpDtlsList)=>{
   console.log('new grp dtls',updatedGrpDtlsList.userGroupDetailsList)
   const userGroupDetailsList=updatedGrpDtlsList.userGroupDetailsList;
    
    this.props.updateUserGroupDetailsList({userGroupDetailsList})
    this.setState({
      userGroupDetailsList:userGroupDetailsList
    })
    sessionStorage.setItem("userGroupDetailsList",JSON.stringify(userGroupDetailsList));
    
  }
  componentDidUpdate(prevProps,prevState){
    //  if(prevState.userGroupDetailsList!==this.state.userGroupDetailsList){
    //    console.log('need to fetch grp list')
    //  }
//     }
//     console.log('comopnnet updated')
// console.log(this.props);
// //this.props.history.push("/home")
// console.log(prevProps);
 }
changedCustDetails=(newDetails)=>{
  console.log('changed cust details',newDetails)
  const custDetails=this.state.custDetails;
  console.log(newDetails.updatedCustdetails.currencyId)
  custDetails.currencyId=newDetails.updatedCustdetails.currencyId;
  custDetails.timezoneId=newDetails.updatedCustdetails.timezoneId
  custDetails.phnNumber=newDetails.updatedCustdetails.custPhnNmbr;
  custDetails.languageId=newDetails.updatedCustdetails.languageId;
  custDetails.image=newDetails.updatedCustdetails.image;
  this.setState({
custDetails:custDetails
  })
  console.log('final custdetails:',custDetails)
  sessionStorage.setItem("custDetails",JSON.stringify(custDetails));
}
selectedGroup=(groupSelected)=>{
  //const selectedGroup=this.state.selectedGrpDtls;
  this.setState({
    selectedGrpDtls:groupSelected
  })
}
clickedGroup=(clickedGrp)=>{
  console.log(clickedGrp)
  const selectedGrp=clickedGrp.clickedUsergroup;
  console.log(selectedGrp)
   this.props.history.push({pathname:'/group/expenses',
    selectedGrpDtl:{
      clickedUsergroup:selectedGrp
    }
  })
}
changedGrpList=(newGrpList)=>{
  console.log('group list changed');
const userGroupDetailsList=newGrpList.groupList;
this.props.updateUserGroupDetailsList({userGroupDetailsList})
sessionStorage.setItem("userGroupDetailsList",JSON.stringify(userGroupDetailsList));
this.setState({
  userGroupDetailsList:userGroupDetailsList
})

}
fetchedProfDtls=(updatedProfDtls)=>{
  console.log('updatedProfDtls',updatedProfDtls);
const profDtls=updatedProfDtls.profDtls;
this.props.saveProfDtls({profDtls})
this.setState({
  profDtls:profDtls
})

}
  render() {
    console.log(this.props);
    console.log(this.state);
    let header = null;
    //  if (!cookie.load("cookie")) this.props.history.push("/");
    if (!this.state.loggedIn) {
      console.log("redirect");
      cookie.remove("cookie");
      sessionStorage.clear();
      return <Redirect to="/" />;
      // this.props.history.push("/");
    } else
      return (
        // <BrowserRouter>
        <HashRouter>
          <div>
            <Header custDetails={this.state.custDetails} loggedIn={this.state.loggedIn} logOut={this.logOut} />;
            <div className="grid-container">
              <div className="left-side">
                <LeftSideBar
                  custDetails={this.state.custDetails}  
                  userGroupDetailsList={this.state.userGroupDetailsList}
                  clickedGroup={this.clickedGroup}              
                />
              </div>

              <div className="center-area">
                <Route path="/"
                  render={props => (
                    <Dashboard {...props} custDetails={this.state.custDetails}
                     groupDetails={this.state.userGroupDetailsList}
                   
                     />)} 
                
                exact />
                <Route
                  path="/recentactivity"
                  render={props => (
                    <RecentActivity {...props} custDetails={this.state.custDetails}
                     groupDetails={this.state.userGroupDetailsList}  />
                  )}
                  exact
                />

                <Route
                  path="/mygroup"
                  render={props => (
                    <MyGroup {...props} custDetails={this.state.custDetails}
                    userGroupDetailsList={this.state.userGroupDetailsList}
                     changedGrpList={this.changedGrpList} />
                  )}
                  exact
                />
                {/* <Route path="/group/new" component={CreateGroup} exact /> */}

                <Route
                  path="/group/new"
                  render={props => (
                    <CreateGroup
                      {...props}
                      custDetails={this.state.custDetails}
                      userGroupDetailsList={this.state.userGroupDetailsList}
                      newGroup={this.newGroupCreated}
                    />
                  )}
                  exact
                />

                <Route
                  path="/group/expenses/:groupId"
                  render={props => (
                    <GroupExpenses
                      {...props}
                      custDetails={this.state.custDetails}
                      userGroupDetailsList= {this.state.userGroupDetailsList}
                      grpDtl={this.state.selectedGrpDtls}
                    />
                  )}
                  exact
                />
                <Route
                  path="/allexpenses"
                  render={props => (
                    <AllExpenses
                      {...props}
                      custDetails={this.state.custDetails}  
                                        
                    />
                  )}
                  exact
                />

                 <Route
                  path="/myprofile"
                  render={props => (
                    <MyProfile
                      {...props}
                      custDetails={this.state.custDetails}  
                      custDetailsUpdated={this.changedCustDetails}
                      groupSelected={this.selectedGroup}  
                      profDtls={this.state.profDtls}
                      fetchedProfDtls={this.fetchedProfDtls}
                                   
                    />
                  )}
                  exact
                />

                {/* <Route path="/allexpendes" component={Login} exact /> */}
                {/* <Dashboard /> */}
              </div>
         
            </div>
          </div>
          </HashRouter>
     //   </BrowserRouter>
      );
  }
}

const mapStateToProps = state => {
console.log('state',state)
  return {
     custDetails: state.custDetails,
     userGroupDetailsList:state.userGroupDetailsList,
     profDtls:state.profileDtls
   };
};

function mapDispatchToProps(dispatch) {
  console.log('in dispatch')
  return ({
    reset: () => dispatch(reset()),
  
    updateCustDetails:(custDetails)  =>dispatch(updateCustDetails(custDetails)),
    updateUserGroupDetailsList:userGroupDetailsList=>dispatch(updateUserGrpList(userGroupDetailsList)),
     saveProfDtls:profDtls=>dispatch(saveProfDtls(profDtls))
    
  });
}
const HomePageR = connect(mapStateToProps,mapDispatchToProps)(HomePage);
export default HomePageR;
// export default resetstate;


