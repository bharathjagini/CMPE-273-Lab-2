import React, { Component } from "react";
import axios from "axios";
import "./MyGroup.css";
import { Link, NavLink } from "react-router-dom";
import config from '../../../config.json';
import cookie from "react-cookies";
import { connect } from "react-redux";
import {updateUserGrpList}  from "../../../redux/actions/index";


class MyGroup extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      custDetails: this.props.custDetails,
      pendingInvites: [],
      userGroupDetailsList:this.props.userGroupDetailsList,
      filteredGroups:[],
      groupSelected:false,
      selectedGroupDtl:{}
    };
  }
  componentDidMount() {
    axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
    axios
      .get(
        config.backEndURL+"/users/groupInvites/" +
          this.state.custDetails.custId
      )

      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          console.log(response.data);
          this.setState({
            pendingInvites: response.data
          });
        }
      })
      .catch(error => {
        console.log(error.response);
        // this.setState({
        //   signUpDone: false,
        //   errorMsg: error.response.data.errorDesc
      });
  }

  leaveGroup= async (groupId)=>{

    const deleteFlag=window.confirm("Do you really want to exit from the group?")
    if(deleteFlag){
   const userGroupDetailsList= await this.deleteGroupFromDB(groupId)
this.props.changedGrpList({
  groupList:userGroupDetailsList
})   
    } 
  }

  deleteGroupFromDB=(groupId)=>{
    return new Promise((resolve,reject)=>{
      const custId=this.state.custDetails.custId
      const exitGroupReq={
        custId:custId,
        groupId:groupId
      }
      axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
 axios
      .put(config.backEndURL+"/users/exitGroup",exitGroupReq)

      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          console.log(response.data);
                    const groupList = this.state.userGroupDetailsList;
          const deletedGroupIndex = groupList.findIndex(
            group => (group.groupId._id === groupId)
          );
          console.log(deletedGroupIndex)
          if (deletedGroupIndex !== -1)
            groupList.splice(deletedGroupIndex, 1);

          this.setState({
        userGroupDetailsList:groupList });
        
  alert("Successfully deleted")
return resolve(groupList);
        
        }
      })
      .catch(error => {
        console.log(error.response);
     alert(error.response.data.message)
      });
    })
  }
  acceptInvitation = groupId => {
    const accInv=window.confirm("Do you want to join the group");
    if(accInv){
    const acceptInviteReq = {
      custId: this.state.custDetails.custId,
      groupId: groupId
    };
    axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
    axios
      .put(config.backEndURL+"/users/acceptInvite", acceptInviteReq)

      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          console.log(response.data);
          const pendingInvites = this.state.pendingInvites;
          const deleteInviteIndex = pendingInvites.findIndex(
            pendingInvite => (pendingInvite.groupId._id === groupId)
          );

          console.log(deleteInviteIndex)
          if (deleteInviteIndex !== -1){
            const acceptedGroup=pendingInvites[deleteInviteIndex];
            pendingInvites.splice(deleteInviteIndex, 1);
               const userGroupDetailsList=this.state.userGroupDetailsList;
           
        
          userGroupDetailsList.push(acceptedGroup);
          console.log('group list:',userGroupDetailsList);
        this.props.changedGrpList({
       groupList:userGroupDetailsList
})    
          this.setState({
            pendingInvites: pendingInvites
          });
       

        
        }
          console.log("pending invite", this.state.pendingInvites);
        }
      })
      .catch(error => {
        console.log(error.response);
        // this.setState({
        //   signUpDone: false,
        //   errorMsg: error.response.data.errorDesc
      });
    }
  };
  searchGroup=(e)=>{
    const searchString=e.target.value;
   
  const filterdGroups= this.state.userGroupDetailsList.filter(group=>{
     return group.groupId.groupName.toUpperCase().includes(searchString.toUpperCase())})
   
     this.setState({
       filteredGroups:filterdGroups
     })
  }
  selectedGroup=(index)=>{
    const groupDetailsList=this.state.userGroupDetailsList;

   this.setState({
     groupSelected:true,
     selectedGroupDtl:groupDetailsList[index]
   })
  
 

  }
  render() {
    if(this.state.groupSelected)
    {
      const selectedGroupDtl=this.state.selectedGroupDtl;
     this.props.history.push({pathname:"/group/expenses"},
      selectedGroupDtl)
    }
    console.log("state", this.state);
    let pendingInvites = null;
    let searchGroups=null;
    if (this.state.pendingInvites.length > 0) {
      pendingInvites = this.state.pendingInvites.map((pendingInvite, index) => {
      
        return (
          <div className="flex-item" key={pendingInvite.groupId._id}>
            {/* onClick={() => this.props.groupExpDtls(userGroup.group_id)} */}
            <span>{pendingInvite.groupId.groupName}</span>
            <button
              className="acceptInvitation"
              onClick={() => {
                this.acceptInvitation(pendingInvite.groupId._id);
              }}
            >
              Accept
            </button>
          </div>
        );
      });
    } else {
      pendingInvites = "No Pending Invitations";
    }
    if(this.state.filteredGroups.length>0)
    {
  searchGroups=   this.state.filteredGroups.map((group,index)=>{
const groupId=group.groupId._id;
          return (
          <div className="flex-item" key={index}>
            {/* onClick={() => this.props.groupExpDtls(userGroup.group_id)} */}
          <Link to={{pathname:"/group/expenses/"+groupId,
          expDtls:{
            groupDetails:group,
            custDetails:this.state.custDetails,
          }}}>
             <span >{group.groupId.groupName}</span>
          </Link>
          </div>
      );
     }) 
    }
    else if(this.state.userGroupDetailsList.length>0)
    {
searchGroups=   this.state.userGroupDetailsList.map((group,index)=>{
const groupId=group.groupId._id;
          return (
        
          <div className="flex-item" key={index}>
            {/* onClick={() => this.props.groupExpDtls(userGroup.group_id)} */}
          <Link to={{pathname:"/group/expenses/"+groupId,
          expDtls:{
            groupDetails:group,
            custDetails:this.state.custDetails,
          }}}>
             <span >{group.groupId.groupName}</span>
          </Link>
              <button
              className="exitGroup"             
            onClick={() => {
                this.leaveGroup(group.groupId._id);
              }}
            >
              Leave
            </button> 
          
            </div>
         
                 
         
          );
})
    }
    return (
      <div className="mygroup-grid-container">
        <div className="pending-invitations">
          <h2>Pending Invitations</h2>
          <div className="flex-container">{pendingInvites}</div>
        </div>
        <div className="my-groups">
          <h2>Search Groups</h2><br/>
          <input type="text" onChange={this.searchGroup}/>
          {searchGroups}
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  console.log('in dispatch')
  return ({
  
    updateUserGroupDetailsList:userGroupDetailsList=>dispatch(updateUserGrpList(userGroupDetailsList)),
    
  });
}
export default connect(null,mapDispatchToProps)(MyGroup);
