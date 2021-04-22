import React, { Component } from "react";
import splitwisewithoutname from "../../../assets/images/splitwisewithoutname.svg";
import axios from "axios";
import "./CreateGroup.css";
import ClearIcon from "@material-ui/icons/Clear";
import config from '../../../config.json';
import { connect } from "react-redux";
import {updateUserGrpList}  from "../../../redux/actions/index";


class CreateGroup extends Component {
  constructor(props) { 
    super(props);
    // console.log(this.props);
    this.state = {
      groupName: "",
      groupMembers: [],
      initialGroup: [1, 2, 3],
      custDetails: this.props.custDetails,
   
      groupCreated:false,
      groupId:0,
      allCustomerDetails:[],
      userGroupDetailsList:this.props.userGroupDetailsList
    };
  }

  componentDidMount()
  {
    console.log('before all cust')
    axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
      axios
      .get(config.backEndURL+"/users/allCustomers")
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          console.log(response);
          this.setState({
            allCustomerDetails:response.data           
          })   
          console.log(this.state.custDetails);                
        } else {
          
        }
      })
      .catch(error => {
        console.log(error.response);
        alert(error.response.data.message);
      });
  }
  groupNameChanged = e => {
    const name = e.target.value;
    this.setState({
      groupName: name
    });
  };
  memberNameChanged = (e, id) => {
    console.log(id);
    
    let custEmail,custId, groupMember;
    const allCustomerDetails=this.state.allCustomerDetails;
    const custIndex=allCustomerDetails.findIndex(cust=>cust.custName===e.target.value);
    if(custIndex>-1){
     custEmail=allCustomerDetails[custIndex].custEmail;
     custId=allCustomerDetails[custIndex]._id;
    
    
    let groupMembers = this.state.groupMembers;
   
    const groupMemberIndex = groupMembers.findIndex(member => member.id === id);
    console.log(typeof groupMember);
    if (groupMemberIndex === -1) {
      groupMember = {
        id: id,
        name: e.target.value,
        email: custEmail,
        custId:custId
      };
      console.log(groupMember);
      groupMembers.push(groupMember);
      this.setState({
        groupMembers: groupMembers
      });
    } else {
      groupMembers[groupMemberIndex].name = e.target.value;
      groupMembers[groupMemberIndex].email = custEmail;
      this.setState({
        groupMembers: groupMembers
      });
    }
  }
  else{
    const groupMember = {
      id: id,
      name: e.target.value,
      email: '',
      custId:0
    };
    let groupMembers = this.state.groupMembers;
    const groupMemberIndex = groupMembers.findIndex(member => member.id === id);
    groupMembers[groupMemberIndex]=groupMember;
    this.setState({
      groupMembers:groupMembers
    })
    alert("Customer not registered yet")
  }
    console.log(this.state.groupMembers);
  };

  memberEmailChanged = (e, id) => {

    let groupMembers = this.state.groupMembers;
    let groupMember;
    const groupMemberIndex = groupMembers.findIndex(member => member.id === id);
    if (groupMemberIndex === -1) {
      groupMember = {
        id: id,
        name: "",
        email: e.target.value
      };
      console.log(groupMember);
      groupMembers.push(groupMember);
      this.setState({
        groupMembers: groupMembers
      });
    } else {
      groupMembers[groupMemberIndex].email = e.target.value;
      this.setState({
        groupMembers: groupMembers
      });
    }
  };

  removeGroupMember = (index, value) => {
    console.log(index);
    let initialGroup = this.state.initialGroup;
    let groupMembers = this.state.groupMembers;
    initialGroup.splice(index, 1);
    const groupMemberIndex = groupMembers.findIndex(
      member => member.id === value
    );
    console.log(groupMemberIndex);
    if (groupMemberIndex !== -1) groupMembers.splice(groupMemberIndex, 1);
    console.log(initialGroup);
    console.log(groupMembers);
    this.setState({
      initialGroup: initialGroup,
      groupMembers: groupMembers
    });
  };
  changeInitialGroup = () => {
    let initialGroup = this.state.initialGroup;
    console.log(initialGroup);
    console.log("length:", initialGroup.length);
    console.log(initialGroup[initialGroup.length]);
    initialGroup.push(initialGroup[initialGroup.length - 1] + 1);
    console.log(initialGroup);
    this.setState({
      initialGroup: initialGroup
    });
  };

  checkExistingUsers=()=>{
    return new Promise((resolve,reject)=>{
    const groupMemberList=this.state.groupMembers;
    console.log('groupMemberList',groupMemberList);
    const userList=this.state.allCustomerDetails;
    let allExistCust=true;
    for(const grpMember of groupMemberList)
    {
       const userIndex=userList.findIndex(user=>user.custName===grpMember.name);
      if(userIndex===-1)
      allExistCust= false;
      break;
    }
    return resolve(allExistCust);
  })
  }

  saveGroupInDB= ()=>{
     return new Promise((resolve,reject)=>{
     const loggedInCustId = this.state.custDetails.custId;
    const loggedInCustName =this.state.custDetails.custName;
   const groupMembers=this.state.groupMembers;
   let custIds=[];
   if(groupMembers.length>0)
   {
       custIds= groupMembers.map((member=> member.custId));
       custIds.push(loggedInCustId);
       console.log('cust ids',custIds);
   }
   else {
     alert('Please enter atleast one member');
     return;
   }
  
    const createGroupDetails = {
      groupName: this.state.groupName,
      groupMembers: this.state.groupMembers,
      createdCustId: loggedInCustId,
      createdCustName: loggedInCustName,
      custIds:custIds,
    };
    axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
    axios
      .post(config.backEndURL+"/users/createGroup", createGroupDetails)
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 201) {
          console.log(response);
         
          let newGroup={
            groupId:{
            _id:response.data._id,
            groupName:createGroupDetails.groupName        
          },
          inviteAccepted:true,
          removedMember:false,
          custId:{
            _id:this.state.custDetails.custId,
            custName:this.state.custDetails.custName
          }
        }
          this.setState({
            groupCreated:true,
            groupId:response.data._id
          })
          const userGroupDetailsList=this.state.userGroupDetailsList;
          console.log('userGrpList',userGroupDetailsList)
          userGroupDetailsList.push(newGroup);
          this.props.newGroup({userGroupDetailsList});
          //this.props.updateUserGroupDetailsList({userGroupDetailsList})
           return resolve('success');    
        } else {
          
        }
      })
      .catch(error => {
        console.log(error.response);
         alert(error.response.data.desc);
      });
    })
  }
  createGroup = async () => {
    const allExistCust=await this.checkExistingUsers();
    console.log(allExistCust);
         if(allExistCust)
         await this.saveGroupInDB()
         else
         alert("Selected customer not registered")
  };

  render() {
  //  console.log(this.state.custDetails);
    let groupMemberDetails = null;
    let initialGroupMembers = null;
    let userList=null;
    if(this.state.groupCreated)
    {
      this.props.history.push("/")
    }
    if(this.state.allCustomerDetails.length>0)
    {
  userList=    this.state.allCustomerDetails.map(cust=>{
        return(
          <option value={cust.custName}></option>
        )
      })
    }
    if (this.state.groupName.length > 0) {
      initialGroupMembers = this.state.initialGroup.map((value, index) => {
    
       let email="";
       const groupMembers=this.state.groupMembers;
      
        if(groupMembers.length>0){
         const memberIndex=groupMembers.findIndex(member=>member.id===value);
     
         if(memberIndex>-1)
         {
          email= groupMembers[memberIndex].email;
         }
        }
        return (
          <div key={value} className="memberDetails">       
             <input list="custNames"
              type="text"
              name="name"
              placeholder="Name"
              onChange={e => this.memberNameChanged(e, value)}
              className="memberName"
            />
              <datalist id="custNames">
 {userList}
  </datalist>
          
            <input 
              type="text"
              name="email"
              placeholder="email"
              value={email}
              className="memberEmail"
              readOnly
            />

            <ClearIcon
              className="deleteMember"
              onClick={() => this.removeGroupMember(index, value)}
            />
          </div>
        );
      });
      groupMemberDetails = (
        <div className="groupMembers">
          <hr />
          <h2>GROUP MEMBERS</h2>
          <span>
            {this.state.custDetails.custName}(
            {this.state.custDetails.loginUserId})
          </span>
          {initialGroupMembers}
          <span className="addPerson" onClick={this.changeInitialGroup}>
            Add a person
          </span>
          <br />
          <button className="addGroupBtn" onClick={this.createGroup}>
            Save
          </button>
        </div>
      );
    }
    return (
      <div className="createGroup">
        {/* <form onSubmit={this.createGroup}> */}
          <div className="createGroupHeader"></div>
          <div className="createGroupContainer">
            <img
              height="200"
              width="200"
              className="splitwiseImg"
              alt="splitwise"
              src={splitwisewithoutname}
            />
            <div className="createGroupContent">
              <h2>START A NEW GROUP</h2>
              <div className="createGroupLabel">My group shall be called</div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={this.groupNameChanged}
                className="groupName"
              />
              {groupMemberDetails}
            </div>
          </div>
        {/* </form> */}
      </div>
    );
  }
}
const mapStateToProps = state => {
console.log('map state',state.custDetails);
const custDetails=state.custDetails;
console.log('custDetails:',custDetails);
  return { 
     custDetails: state.custDetails,
    userGroupDetailsList: state.userGroupDetailsList 
  }
};
function mapDispatchToProps(dispatch) {
  console.log('in dispatch')
  return ({
    updateUserGroupDetailsList:userGroupDetailsList=>dispatch(updateUserGrpList(userGroupDetailsList)),
    
  });
}
export default connect(mapStateToProps,mapDispatchToProps)(CreateGroup);
//export default CreateGroupR;
