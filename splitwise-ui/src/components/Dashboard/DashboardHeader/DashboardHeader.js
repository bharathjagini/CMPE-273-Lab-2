import React, { Component } from "react";
import "./DashboardHeader.css";
import Modal from '@material-ui/core/Modal';
import ClearIcon from "@material-ui/icons/Clear";
import axios from 'axios';
import config from '../../../config.json';
import cookie from "react-cookies";
class DashboardHeader extends Component {
  constructor(props) {
console.log(props);
    super(props);
    this.state = {
      custDetails:this.props.custDetails,
      groupDetails: this.props.groupDetails,
    oweDetails:this.props.oweDetails,
      // oweDetails:{
      //   loggedInCustOweAmount:this.props.oweDetails.loggedInCustOweAmount,
      //   loggedInCustPaidAmount:this.props.loggedInCustPaidAmount,
      //   allGrpMemOweList:this.props.oweDetails.allGrpMemOweList,
      //   eachCustOweList:this.props.oweDetails.eachCustOweList
      // },
      settleUpModal:false,
      isDataLoaded:this.props.isDataLoaded,
      selectedMemberId:0,
      selectedGroupId:0,
      settleUsersGroup:[]
    };
  }
  componentWillMount(){
    const oweDetails=this.props.oweDetails;
    this.setState({
      oweDetails:oweDetails
    })
  }
  enableSettleUpModal=()=>{
    console.log(this.state);
    console.log(this.props);
    console.log(this.state.oweDetails.eachCustOweList.length)
    if(this.state.oweDetails.eachCustOweList.length>0)
    this.setState({
      settleUpModal:true
    })
    else
    alert("No group members")
  }
   closeSettleUpModal=()=>{
    this.setState({
      settleUpModal:false
    })
  }
  settleUpNameChanged=(e)=>{
    const selectedMemberId=e.target.value;
    this.setState({
      selectedMemberId:selectedMemberId
    })
  }
  settleUpGroupChanged=(e)=>{
const selectedGroupId=Number(e.target.value);
console.log('selectedGroupId',selectedGroupId)
this.setState({
  selectedGroupId:selectedGroupId
})
if(Number(selectedGroupId)>0)
{
  console.log('inside selected')
  this.fetchCustForGroup(selectedGroupId)
  
}
  }

  fetchCustForGroup=(selectedGroupId)=>{
    axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
  axios
   .get(
     config.backEndURL+"/users/usersGroup?groupId="+selectedGroupId )
   .then(response => {
     console.log("Status Code : ", response.status);
     if (response.status === 200) {
       console.log(response.data);
     this.setState({
      settleUsersGroup:response.data
     })
       
     }
   })
   .catch(error => {
     console.log(error);
     // this.setState({
     //   signUpDone: false,
     //   errorMsg: error.response.data.errorDesc
   });

  }

  settleTxns=()=>{

    console.log(this.state);
    const eachCustOweList=this.state.oweDetails.eachCustOweList;
    const selectedMemberId=Number(this.state.selectedMemberId);
    // if(eachCustOweList.length>0){
    //   const selectedMemberIndex=eachCustOweList.findIndex(cust=>cust.custId===selectedMemberId);
    //  const selectedMemberOweDtls=eachCustOweList[selectedMemberIndex];
    //   if(selectedMemberOweDtls.amount>0)
    // {
    // const settleUpReq={
    //   loggedInCustId:this.state.custDetails.custId,
    //   settleUpCustId:selectedMemberId
    // }
    const settleUpReq={
       loggedInCustId:this.state.custDetails.custId,
       settleUpCustId:selectedMemberId,
       custName:this.state.custDetails.custName
    }
    axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
     axios
      .post(
        config.backEndURL+"/users/settleup/" ,settleUpReq)
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          console.log(response.data);
          this.props.settleUp({});
          this.setState({
               settleUpModal:false
          })
          
        }
      })
      .catch(error => {
        console.log(error);
        // this.setState({
        //   signUpDone: false,
        //   errorMsg: error.response.data.errorDesc
      });
    // } 
    // else alert("You owe some amount.Cannot settle the transactions")
    }
  
  componentDidUpdate(prevProps,prevState)
  {
    if(this.props.oweDetails!==prevProps.oweDetails)
    {
    
      console.log('compo uodated')
      const oweDetails=this.props.oweDetails;
this.setState({
  oweDetails:oweDetails
})

    }
  }          
      //       const oweDetails=this.state.oweDetails;
          // oweDetails.eachCustOweList=this.props.oweDetails.eachCustOweList;
          // oweDetails.allGrpMemOweList=this.props.oweDetails.allGrpMemOweList;
          // oweDetails.loggedInCustOweAmount=this.props.oweDetails.loggedInCustOweAmount;
          // oweDetails.loggedInCustPaidAmount=this.props.oweDetails.loggedInCustPaidAmount;
          // this.setState({
          //   oweDetails: oweDetails
            
          // });

  render() {
    let settleUpMembers=null;
    let settleUpGroups=null;
    
    console.log('changed',this.state);
    if(typeof this.state.groupDetails!==undefined){
      if(this.state.groupDetails.length>0)
      {
        
        settleUpGroups=this.state.groupDetails.map((group,index)=>{
          
    return (
      <option value={group.groupId._id}>{group.groupId.groupName}</option>
    );
  })
  }
    }
    if(typeof this.state.settleUsersGroup!==undefined){
  
      if(this.state.settleUsersGroup.length>0)
      {
        
  this.state.settleUsersGroup.map((user,index)=>{
    if(typeof this.state.oweDetails!==undefined){
  
      if(this.state.oweDetails.eachCustOweList.length>0)
      {
        
  settleUpMembers=this.state.oweDetails.eachCustOweList.map((member,index)=>{
    if(member.custId===user.custId._id)
    return (
      <option value={member.custId}>{member.custName}</option>
    );
  })
  }
      }
  })
  }
      }
   
    return (
      <div className="dashboardHeader">
        <div className="dashboardHeaderData">
          <h1>Dashboard</h1>
           <button type="button" className="settleUpBtn" onClick={this.enableSettleUpModal}>Settle Up </button>
       <Modal
        open={this.state.settleUpModal}
        onClose={this.closeSettleUpModal}
      >
     <div className="content">
       <div className="popupHeader">
        Settle Up with group members
         
            <ClearIcon
              className="closePopup"
              onClick={this.closeSettleUpModal}
            />
         </div>
         <div className="selectGroups">
           <span>Select Group you want to settle amount</span><br/>
           <select className="drpDwn" name="groupName" value={this.state.selectedGroupId} onChange={this.settleUpGroupChanged}>
             <option value="0">Select Group</option>
             {settleUpGroups}
           </select>
</div>     
         <div className="selectMembers">
           <span>Select Member below you want to settle with</span><br/>
           <select className="drpDwn" name="groupName" value={this.state.selectedMemberId} onChange={this.settleUpNameChanged}>
             <option value="0">Select Member</option>
             {settleUpMembers}
           </select>
</div>         
     <div className="modalButtons">
       <button type="button" className="cancelBtnSettle" onClick={this.closeSettleUpModal}>Cancel</button>
       <button type="button" className="saveBtnSettle" onClick={this.settleTxns}>Save</button>
     </div>
     </div>
      </Modal>
        </div>
      </div>
    );
  }
}
export default DashboardHeader;
