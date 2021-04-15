import React, { Component } from "react";
import { Link, NavLink ,Route} from "react-router-dom";
import "./LeftSideBar.css";
import splitwisewithoutname from "../../../assets/images/splitwisewithoutname.svg";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import GroupExpenses from "../../GroupExpenses/GroupExpenses";
import config from '../../../config.json';
import cookie from "react-cookies";
class LeftSideBar extends Component {
  constructor(props) {
    super(props);
console.log(this.props);
    this.state = {
      userGroupDetailsList: this.props.userGroupDetailsList,
      custDetails: this.props.custDetails,
      custGroupDetails: []
    };
    
  }

  componentDidUpdate(prevProps){
    if(prevProps.userGroupDetailsList!==this.props.userGroupDetailsList)
    {
      const groupDtlsList=this.props.userGroupDetailsList
     console.log(groupDtlsList)
      this.setState({
        userGroupDetailsList:groupDtlsList
      })
    }
  }
  componentDidMount() {
    // axios
    //   .get(
    //     "http://localhost:3005/profile/getGroupsForCustomer/" +
    //       this.state.custDetails.custId
    //   )
    //   .then(response => {
    //     console.log("Status Code : ", response.status);
    //     if (response.status === 200) {
    //       console.log(response.data);
    //       this.setState({
    //         userGroupDetailsList: response.data
    //       });
    //       // console.log(this.state.userGroupDetailsList);
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error.response);
    //     // this.setState({
    //     //   signUpDone: false,
    //     //   errorMsg: error.response.data.errorDesc
    //   });
  }
  // getGroupDetails = groupId => {
  //   axios
  //     .get(
  //       "http://localhost:3005/profile/getGroupsForCustomer/" +
  //         this.state.custDetails.custId
  //     )
  //     .then(response => {
  //       console.log("Status Code : ", response.status);
  //       if (response.status === 200) {
  //         console.log(response.data);
  //         this.setState({
  //           userGroupDetailsList: response.data
  //         });
  //         // console.log(this.state.userGroupDetailsList);
  //       }
  //     })
  //     .catch(error => {
  //       console.log(error.response);
  //       // this.setState({
  //       //   signUpDone: false,
  //       //   errorMsg: error.response.data.errorDesc
  //     });
  // };
  //
  clickedGroup=(index)=>{
    console.log("index:",index)
    const userGroupList=this.state.userGroupDetailsList;
    const clickedUsergroup=userGroupList[index];
    this.props.clickedGroup({
      clickedUsergroup
    })
   
  }
  render() {
    let custGroups = null;
    console.log('render',this.state.userGroupDetailsList)
    if (this.state.userGroupDetailsList.length > 0) {
      console.log(this.state.userGroupDetailsList);
      custGroups = this.state.userGroupDetailsList.map((userGroup, index) => {
      const groupId=userGroup.groupId._id;
        return (
          <div className="group-flex-item" key={userGroup.groupId._id}>
            <Link to={{pathname:"/group/expenses/"+groupId,
          expDtls:{
            groupDetails:userGroup,
            custDetails:this.state.custDetails,
          }}}>
            <span>
              {userGroup.groupId.groupName}
            </span>
            </Link>
          </div>
        );
      });
    }
    return (
      <div className="left-side-bar">
        <div className="flex-container">
          <div className="flex-item">
            <NavLink to="/" activeClassName="active">
              <span className="dashboardSelected">
                <img
                  height="5"
                  width="5"
                  alt="splitwise"
                  src={splitwisewithoutname}
                  className="dashboard-img"
                />
              </span>
              Dashboard
            </NavLink>
          </div>
          <div className="flex-item">
            <NavLink to="/recentactivity" activeClassName="active">
              <span></span>
              <label style={{ color: "#FF652F" }}> Recent Activity</label>
            </NavLink>
          </div>
          <div className="flex-item">
            <NavLink to="/allexpenses" activeClassName="active">
              <span></span>
              <label style={{ color: "#999" }}> All Expenses</label>
            </NavLink>
          </div>
          <div className="flex-item">
            <NavLink to="/mygroup" activeClassName="active">
              <span></span>
              <label style={{ color: "#999" }}> My Group</label>
            </NavLink>
          </div>
          <div className="flex-item">
            <NavLink to="/myprofile" activeClassName="active">
              <span></span>
              <label style={{ color: "#999" }}> My Profile</label>
            </NavLink>
          </div>
          
          <div className="group-flex-item">
            <label>GROUPS</label>

            <NavLink to="/group/new">
              <span className="addGroup">+add</span>
            </NavLink>
          </div>
          {custGroups}
          
        </div>
        {/* <section>
          <nav>
            <ul>
              <li>
                <Link to="/home" className="dashboard">
                  <span>
                    <img
                      height="5"
                      width="5"
                      alt="splitwise"
                      src={splitwisewithoutname}
                      className="dashboard-img"
                    />
                  </span>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/recentactivity" className="dashboard">
                  <span></span>
                  Recent Activity
                </Link>
              </li>
              <li>
                <Link to="/recentactivity" className="dashboard">
                  <span></span>
                  All expenses
                </Link>
              </li>
            </ul>
            <div className="groups">
              Groups
              <Link to="/addgroup" className="addgroup">
                <AddIcon />
                <span className="addLink">Add</span>
              </Link>
            </div>
          </nav>
        </section> */}
      </div>
    );
  }
}
export default LeftSideBar;
