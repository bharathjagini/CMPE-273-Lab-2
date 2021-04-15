import React, { Component } from "react";
import expenseDefault from "../../assets/images/expense-desc.png";
import "./RecentActivity.css";
import axios from 'axios';
import numeral from 'numeral';
import config from '../../config.json';
import cookie from "react-cookies";
import { Link } from "react-router-dom";
class RecentActivity extends Component {
  constructor(props) {
    console.log(props);
    super(props);
         this.state={
               custDetails: this.props.custDetails,
      groupDetails: this.props.groupDetails,
      recentActivity: [],
      activityPaginated:[],
      selectedGroupId:0,
      sortOrder:2,
      paginationDefault:2,
      pageNumber:1,
      pageNumbers:[]
      
         }
  }

componentDidMount() {
    const custId=this.state.custDetails.custId;
    //const groupId=this.state.groupDetails.group_id;
    const groupIds=this.state.groupDetails.map(group=>group.groupId._id);
    console.log('groupIDs',groupIds)
    const recentActReq={
      
      groupIds:groupIds
    }
    axios
      .post(
        config.backEndURL+"/users/recentActivity",recentActReq
      )

      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          console.log(response.data);
           let activityPaginated=[];

           let pageNumbers=[];
           for(let i=1;i<=Math.ceil(response.data.length/this.state.paginationDefault);i++)
           pageNumbers.push(i)
          if(response.data.length>this.state.paginationDefault){
           activityPaginated=response.data.slice(0,this.state.pageNumber*this.state.paginationDefault)
          this.setState({
            recentActivity: response.data,
             activityPaginated:activityPaginated ,
             pageNumbers:pageNumbers  
          });
        }
        else{
          this.setState({
            recentActivity: response.data,
            activityPaginated:response.data ,
              pageNumbers:pageNumbers  
          }); 
        }
          console.log(this.state);
        }
        else{

        }
      })
      .catch(error => {
        console.log(error.response);
        // this.setState({
        //   signUpDone: false,
        //   errorMsg: error.response.data.errorDesc
      });
  }
  componentDidUpdate(prevState){
    console.log('updated');
    
  }
 groupNameChanged=(e)=>{
    this.setState({
    selectedGroupId:e.target.value
    })
}
updateActivityState=(recentActivityList)=>{
   this.setState({
       recentActivity:recentActivityList
     })
    
}
sortOrderChanged=(e)=>{
  console.log(e.target.value);
  const sortOrder=Number(e.target.value);
  
  if(sortOrder===1){
    console.log('inside')
  let recentActivityList=this.state.recentActivity;
          recentActivityList=recentActivityList.sort((activity1,activity2)=>{
        return new Date(activity2.createdDate).getTime()-new Date(activity1.createdDate).getTime()}).reverse();
    this.setState({
       sortOrder:Number(e.target.value),
      recentActivity:recentActivityList
    })
    console.log(this.state.recentActivity);
  }
   else
   {
  let recentActivityList=this.state.recentActivity;
          recentActivityList=recentActivityList.sort((activity1,activity2)=>{
        return new Date(activity1.createdDate).getTime()-new Date(activity2.createdDate).getTime()}).reverse();
    this.setState({
       sortOrder:Number(e.target.value),
      recentActivity:recentActivityList
    })
     
   }
  }
  changePaginationValue=(e)=>{
    let pageNumbers=[];
       for(let i=1;i<=Math.ceil(this.state.recentActivity.length/Number(e.target.value));i++)
           pageNumbers.push(i)
    const recentActivity=this.state.recentActivity;
    let activityPaginated=this.state.activityPaginated;
    if(recentActivity.length>=Number(e.target.value)){
activityPaginated=recentActivity.slice(0,this.state.pageNumber*Number(e.target.value))
    }
    else
    activityPaginated=recentActivity;
    this.setState({
      paginationDefault:Number(e.target.value),
      activityPaginated:activityPaginated,
      pageNumbers:pageNumbers
    })
  }
  paginate=(currentPage)=>{
    const indexOfLastExp=currentPage*this.state.paginationDefault;
    const indexOfFirstExp=indexOfLastExp-this.state.paginationDefault;
    const recentActiviy=this.state.recentActivity;
    const activityPaginated=recentActiviy.slice(indexOfFirstExp,indexOfLastExp);
    this.setState({
      activityPaginated:activityPaginated
    })
  }
  render() {
    let recentActivity=null;
    let groupNames=null;
    //let recentActivityList=this.state.recentActivity;
     let recentActivityList=this.state.activityPaginated;
     let currency=this.state.custDetails.currencyValue;
    if(this.state.groupDetails.length>0)
    {
      console.log('asdf')
      groupNames=this.state.groupDetails.map((group,index)=>{
       return(<option value={group.groupId._id}>{group.groupId.groupName}</option>);
      })
    }
    if(this.state.selectedGroupId>0&&recentActivityList.length>0)
    {
       const groupId=Number(this.state.selectedGroupId);
     console.log(typeof groupId)
       console.log(this.state.selectedGroupId,recentActivityList)
      recentActivityList=recentActivityList.filter(activity=>activity.groupId._id===groupId);
    console.log(recentActivityList)
    }
    // if(this.state.sortOrder===2)
    // {
    //   recentActivityList=recentActivityList.sort((activity1,activity2)=>{
    //     return new Date(activity1.created_date).getTime()-new Date(activity2.created_date).getTime()}).reverse();
    // this.updateActivityState(recentActivityList)
    //   }
    //
     if(recentActivityList.length>0)
    {
     
      recentActivity=recentActivityList.map((activity,index)=>{
        let owe=null;
        let getsBack=null;
       let custAdded=this.state.custDetails.custName.trim().toUpperCase()===activity.createdByCustId.custName.trim().toUpperCase() ?'You':activity.createdByCustId.custName;
      let recentActAmount=activity.actAmount;
      if(recentActAmount<0){
        recentActAmount=numeral(Math.abs(recentActAmount)).format("0.00");
        owe=(<span style={{color:'#ff652f'}}>You owe {currency}{recentActAmount}</span>)
       
       }
        else{
       recentActAmount=numeral(Math.abs(recentActAmount)).format("0.00");
          getsBack=(<span style={{color:'#5bc5a7'}} >You get back {currency}{recentActAmount}</span>)
        
      }
       return(<div className="flex-item" key={activity._id}>
          
          <img  className="expImg" alt="splitwise" src={expenseDefault}/>
          <div>
            <span style={{fontWeight:'bold'}}>{custAdded} </span>
            <span>added </span>
            "<span style={{fontWeight:'bold'}}>{activity.expenseDesc} </span>" in
            <span> {activity.groupId.groupName} </span><br/>
        {owe}{getsBack}
         </div>
          </div>);
        
      });
    }
    else 
    recentActivity=(<span style={{fontWeight:'bold',textAlign:'center',marginLeft:'200px'}}>No Activity to show</span>)
    return(
        <div className="recentActivity">
            <div className="recentActivityHeader">
              <h1>Recent Activity</h1>
            </div>
            <br/>
            <div className="filterRecentActivity">
              <div className="filterByGrpName">
                 <span>Filter By Group Name</span><br/>
            <select name="groupName" value={this.state.selectedGroupId} onChange={this.groupNameChanged}>
           
            <option value="0">Select Group Name</option>
            {groupNames}
            </select>
            </div>
            <div className="mostRecent">
               <span>Sort By</span><br/>
               <select name="groupName" value={this.state.sortOrder} onChange={this.sortOrderChanged}>
                <option value="1">Most Recent First</option>
                <option value="2">Most Recent Last</option>
                </select>
            </div>
            </div>
            {recentActivity}

             <div className="pagination">
              <div className="filterByGrpName">
                 <span>Set Maximum values</span><br/>
            <select name="groupName" value={this.state.paginationDefault} onChange={this.changePaginationValue}>
           
            <option value="0">Select Maximum activities to display</option>
              <option value="2">2</option>
               <option value="5">5</option>
                <option value="10">10</option>
            </select>
            </div>
            </div>
            <div className="paginationNumbers">
       <nav>
         <ul className="pagination">
           {this.state.pageNumbers.map(number=>{
           return   <li key={number} className="page-item">
               <Link onClick={()=>this.paginate(number)}  className="page-link">
                 {number}
               </Link>
             </li>
           })}
         </ul>
       </nav>
            </div>
            </div>
           
     
    );
  }
}
export default RecentActivity;
