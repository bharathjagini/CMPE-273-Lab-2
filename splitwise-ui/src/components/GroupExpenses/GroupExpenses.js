import React, { Component } from "react";
import axios from "axios";
import "./GroupExpenses.css";
import numeral from 'numeral';
import Modal from '@material-ui/core/Modal';
import ClearIcon from "@material-ui/icons/Clear";
import splitwise from "../../assets/images/group-icon.png";
import expenseDefault from "../../assets/images/expense-desc.png";
import expense from "../../assets/images/expense-desc.png";
import moment from "moment";
import config from '../../config.json';
import cookie from "react-cookies";
class GroupExpenses extends Component {
  constructor(props) {
    super(props);
    console.log(this.props)
    this.state = {
      custDetails: this.props.custDetails,
      groupDetails:{
        groupId:{
          _id:0,
          groupName:""
        }
      },
      groupExpenses: [],
      otherCustGrpPayList:[],
      enableExpModal:false,
      custIds:[],
      userGroupDetailsList:this.props.userGroupDetailsList,
      groupId:Number(this.props.match.params.groupId),
      newExpenseDtls:{
       expenseDesc:"",
       custId:this.props.custDetails.custId,
       groupId:Number(this.props.match.params.groupId),
      amount:0,
      custName:this.props.custDetails.custName,
     custIds:[],
     expenseId:0
      },
      splittedAmount:0.00,
      enableCommentModal:false,
      selectedExpense:{},
      commentDesc:"",
      comments:[]
    };
    console.log(this.state.custDetails);
  }
  componentWillMount()
  {
    console.log(this.state.custDetails)
  }
  
  
   componentDidMount() {

    const groupId=Number(this.state.groupId);
   const userGroupDetailsList=this.state.userGroupDetailsList;
  console.log('groupid',groupId)
   console.log(userGroupDetailsList)
    const groupIndex=userGroupDetailsList.findIndex(group=>group.groupId._id===groupId);
  console.log("index",groupIndex)
    if(groupIndex>-1)
    {
      const selectedGroup=userGroupDetailsList[groupIndex];
    this.setState({
      groupDetails:selectedGroup
    })
      this.fetchGroupExpenses();
    }
    else{
      alert("Invalid group id")
    }
  //   this.fetchCustIdsForGroup();
  }
  fetchGroupExpenses(){
 //   return new Promise((resolve,reject)=>{
    const custId=this.state.custDetails.custId;
    const groupId=this.state.groupId;
    
    console.log('inside api',custId,groupId)
    axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
    axios
      .get(
        config.backEndURL+"/users/grpExpDtls?groupId=" +
        groupId
      )

      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
         console.log(response);
          this.setState({
            groupExpenses: response.data.groupExpenses,
            otherCustGrpPayList:response.data.otherCustGrpPayList,
            custIds:response.data.custIds
          });
          //return resolve(response);
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
   //   })
  }
 componentDidUpdate(prevProps,prevState){
    console.log('updated',this.state)
    console.log(prevState);
    console.log(prevProps);
    console.log(this.props);
    console.log(prevProps)
    if(Number(prevProps.match.params.groupId)!==Number(this.props.match.params.groupId))
    {
      const newGroupId=Number(this.props.match.params.groupId);
        const userGroupDetailsList=this.props.userGroupDetailsList;
        const groupIndex=userGroupDetailsList.findIndex(group=>group.groupId._id===newGroupId);
  console.log("index",groupIndex)
    if(groupIndex>-1)
    {
      const newExpenseDtls=this.state.newExpenseDtls;
      newExpenseDtls.groupId=newGroupId;
      const selectedGroup=userGroupDetailsList[groupIndex];
    this.setState({
      groupDetails:selectedGroup,
      groupId:newGroupId,
      newExpenseDtls:newExpenseDtls
    },this.fetchGroupExpenses)
    }
    }
 if(prevProps.userGroupDetailsList!==this.props.userGroupDetailsList)
 {
   const newUserGroupDetailsList=this.props.userGroupDetailsList;
   this.setState({
     userGroupDetailsList:newUserGroupDetailsList
   })
 }   
     
 
  }
  openModal=()=>{
    const custIdList=this.state.custIds;
     const custId=this.state.custDetails.custId;
    const filteredCustIds=custIdList.filter(cust=>cust!==custId);
    console.log(filteredCustIds)
    if(filteredCustIds.length>0){
console.log('inside')
    this.setState({
         enableExpModal:true
            });
          }
else{
  alert("No group member accepted the invite")
}

  }
 closeExpModal=()=>{
   
this.setState({
  enableExpModal:false
})
};
changedNewExpenseAmnt=(e)=>{
  const groupCount=this.state.groupDetails.groupCount;
  const splitAmount=e.target.value/groupCount;
  this.setState({splittedAmount:splitAmount})
  let newExpense=this.state.newExpenseDtls;
  newExpense.amount=e.target.value;
this.setState({
  newExpenseDtls:newExpense
})
}
changedNewExpenseDesc=(e)=>{
  
  let newExpense=this.state.newExpenseDtls;
  newExpense.expenseDesc=e.target.value;
this.setState({
  newExpenseDtls:newExpense
})
}
createExpense=async ()=>{
  await this.createExpenseDbCall();
  await this.fetchGroupExpenses();

}

createExpenseDbCall=()=>{
  return new Promise((resolve,reject)=>{
    const custIdList=this.state.custIds;
    const custId=this.state.custDetails.custId;
    const filteredCustIds=custIdList.filter(cust=>cust!==custId);
  let newExpenseReq={
    groupId:this.state.groupDetails.groupId._id,
    custId:this.state.custDetails.custId,
    expenseDesc:this.state.newExpenseDtls.expenseDesc,
    amount:this.state.newExpenseDtls.amount,
    custIds:filteredCustIds,
    custName:this.state.custDetails.custName

  }
  
  axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
    axios
      .post(
        config.backEndURL+"/users/createExpense",newExpenseReq
      )

      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 201) {
         console.log(response);
         let newExpense={
           _id:response.data._id,
           amount:Number(response.data.amount),
           expenseDesc:response.data.expenseDesc,
           createdBy:response.data.createdBy
         }
         let newExpenseList=[newExpense,...this.state.groupExpenses]
        this.setState({
          enableExpModal:false,
          groupExpenses:newExpenseList
        })
        return resolve(response.data);
          //return resolve(response);
       
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
      })
}
openCommentModal=(expense)=>{
  console.log('expense',expense)
  this.setState({
    enableCommentModal:true,
    selectedExpense:expense
  })

  axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
 axios
      .get(
        config.backEndURL+"/users/comments/"+expense._id
      )

      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
         console.log(response);
         const comments=response.data;
         this.setState({
           comments:comments
         })
        }
        else{

        }
      })
      .catch(error => {
        console.log(error);
      });
}
closeCommentModal=()=>{
  this.setState({
    enableCommentModal:false
  })
}
commentChanged=(e)=>{
this.setState({
  commentDesc:e.target.value
})
}
postComment=()=>{
const commentDesc=this.state.commentDesc;
if(commentDesc.length===0)
alert("Please enter comment to post")
else
{
const selectedExpense=this.state.selectedExpense;
const createCommentReq={
  expenseId:selectedExpense._id,
  createdBy:this.state.custDetails.custName,
  createdByCustId:this.state.custDetails.custId,
  commentDesc:commentDesc
}
axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
 axios
      .post(
        config.backEndURL+"/users/createComment",createCommentReq
      )

      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 201) {
         console.log(response);
         let newComment={
           _id:response.data._id,
          createdBy:response.data.createdBy,
           commentDesc:response.data.commentDesc,
           createdByCustId:response.data.createdByCustId,
           deletedComment:false,
           createdDate:response.data.createdDate
         }
      const comments=this.state.comments;
      comments.push(newComment);
        this.setState({
          comments:comments,
          commentDesc:""
        })
     
          //return resolve(response);
       
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
}
deleteComment=(comment)=>{

  const deleteCmntFlag=window.confirm('Are you sure you want to delete this comment?');
  if(deleteCmntFlag){
const expense=this.state.selectedExpense;
console.log('comment',comment,'expense',expense);
const deleteCommentReq={
  commentId:comment._id,
  expenseId:expense._id,
  modifiedBy:this.state.custDetails.custName,
  modifiedByCustId:this.state.custDetails.custId
}
console.log(deleteCommentReq);
axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token');
axios
      .delete(
        config.backEndURL+"/users/deleteComment",{data:deleteCommentReq}
      )

      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
         console.log(response);
        

      const comments=this.state.comments;
     
     const commentIndex= comments.findIndex(cmnt=>cmnt._id===comment._id);
     comments.splice(commentIndex,1);
        this.setState({
          comments:comments,
        })
     
        
       
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
}
  render() {
    let groupExpenses=null;
    let data=null;
    let expModal=null;
    let custPaidDtl=null;
    let eachCustOweDtls=null;
    let custOwe=null;
    let otherCustOwe=null;
    let commentModal=null;
    let displayComments=null;
   // console.log('asdf')
    console.log(this.state);
 
 


//==========================================

if(this.state.comments.length>0)
{
 displayComments=  this.state.comments.map((comment)=>{
  const createdDate=moment(comment.createdDate).format("YYYY-MM-DD HH:mm:ss")
   return(
     <div className="displayComments">
       <div className="commentHeader">
         <span style={{fontWeight:'bold'}}>{comment.createdBy}</span> <span>{createdDate}</span>
         <ClearIcon
              className="deleteComment"
              onClick={()=>this.deleteComment(comment)}
            />
 </div>
 {comment.commentDesc}
     </div>
   );

  })
}


if(this.state.enableCommentModal)
{
const expense=this.state.selectedExpense;
  commentModal=(  <div className="expCmntModal"> 
     <div className="expCmntContent">
       <div className="popupHader">
         {/* Add Notes and Comments for {expense.expenseDesc} */}
         
            {/* <ClearIcon
              className="closePopup"
              onClick={this.closeCommentModal}
            /> */}
         </div>
         <div className="comments">
        <h4 style={{color:'#999',marginTop:'10px'}}>Notes and Comments</h4>
        {displayComments}
        <div className="newComment">
         <textarea style={{ marginLeft:'1px', width:'200px',fontSize:'13px'}} 
         rows="2" cols="10" placeholder="Add comment"
         onChange={this.commentChanged} value={this.state.commentDesc}
         ></textarea>
         <br/>
         <button className="postCmntBtn" onClick={this.postComment}>Post</button>
         </div>
      </div>
      </div>
      </div>)


 }

//==========================================


    if(this.state.otherCustGrpPayList.length>0)
    {
    eachCustOweDtls= this.state.otherCustGrpPayList.map(cust=>{
     otherCustOwe=null;
     custOwe=null;
     const currency=this.state.custDetails.currencyValue;
const currencyNumber=currency+numeral(cust.amount).format("0.00");
 if(cust.amount>0){
  otherCustOwe=(<div><span style={{color:'#000',fontWeight:'bold',fontSize:'16px'}}>{cust.custName}</span><br/><span style={{color:'#5bc5a7'}}> gets back<span style= {{color:'#5bc5a7',fontWeight:'bold'}}> {currencyNumber} </span></span></div>)
     }
     else if(cust.amount<0){
       const  absValue= currency+numeral(Math.abs(cust.amount)).format("0.00");
 custOwe=( <div><span style={{color:'#000',fontWeight:'bold',fontSize:'16px'}}>{cust.custName}</span><br/>
<span style={{color:'#ff652f'}}>owes <span style={{color:'#ff652f',fontWeight:'bold'}}>{absValue}</span> </span></div>)

     }
      return(
        <div className="flex-item" key={cust.custId}>
       {otherCustOwe}
        {custOwe}
        </div>
      );
})
    }
    //console.log(this.state.groupExpenses);
    if(this.state.groupExpenses.length>0)
    {
     const currency=this.state.custDetails.currencyValue; 
     // console.log('asdf');
      groupExpenses=this.state.groupExpenses.map((groupExpense,index)=>{

//==========================
const expense=this.state.selectedExpense;
if(expense._id===groupExpense._id)
  commentModal=(  <div className="expCmntModal"> 
     <div className="expCmntContent">
       <div className="popupHader">
         {/* Add Notes and Comments for {expense.expenseDesc} */}
         
            {/* <ClearIcon
              className="closePopup"
              onClick={this.closeCommentModal}
            /> */}
         </div>
         <div className="comments">
        <h4 style={{color:'#999',marginTop:'10px'}}>Notes and Comments</h4>
        {displayComments}
        <div className="newComment">
         <textarea style={{ marginLeft:'1px', width:'200px',fontSize:'13px'}} 
         rows="2" cols="10" placeholder="Add comment"
         onChange={this.commentChanged} value={this.state.commentDesc}
         ></textarea>
         <br/>
         <button className="postCmntBtn" onClick={this.postComment}>Post</button>
         </div>
      </div>
      </div>
      </div>)
      else commentModal=null;

//========================


       
     //   const month=moment(d.month()+1,'MM').format('MMMM')
  const createdDate=moment(groupExpense.createdDate).format("YYYY-MM-DD HH:mm:ss")
        const groupSize=this.state.otherCustGrpPayList.length;
        const currencyNumber=currency+numeral(groupExpense.amount).format("0.00");
        const dividedAmount=currency+numeral(groupExpense.amount/groupSize).format("0.00");
      // console.log(this.state.custDetails.custName.toUpperCase(),groupExpense.createdBy.toUpperCase());
       const lent=( <div className='lent'>{groupExpense.createdBy} lent you <br/><span className='negative'>{dividedAmount}  </span></div>);
       const paid=(<div className='lent'>you lent<br/><span className='positive'>{dividedAmount}  </span></div>);
        data=this.state.custDetails.custName.trim().toUpperCase()===groupExpense.createdBy.trim().toUpperCase() ?paid:lent;
       console.log('done')
       const custPaid=( <div className="paid">
              you paid
              <br/>
             <span className="amount">{currencyNumber}  </span>
          </div>
          );
       const otherCustPaid=(<div className="paid">
               {groupExpense.createdBy} paid
              <br/>
             <span className="amount">{currencyNumber}  </span>
          </div>);
        custPaidDtl=this.state.custDetails.custName.trim().toUpperCase()===groupExpense.createdBy.trim().toUpperCase() ?custPaid:otherCustPaid;
      

        return (
          <div className="flex-item" key={groupExpense._id}>
          
          <div className="expense-grid-container">
          <div className="expenseDesc">
             {/* <div className="expDate">
             {month.substring(0,3)}
            
            <div className="date"> 21</div>
             </div> */}
               <img  className="expImg" alt="splitwise" src={expenseDefault}/>
            <span>{groupExpense.expenseDesc} </span>
            <button type="button" className="editExpBtn" onClick={()=>this.openCommentModal(groupExpense)}>Edit Expense</button>
            <br/>
            <span>{createdDate}</span>
            <br/>
            <span >
           {commentModal}
           </span>
             </div>
             {/* <div className="expense" > */}
            {/* <div className="paid">
              {groupExpense.cust_name} paid
              <br/>
             <span className="amount">{currencyNumber}  </span> 
            
          </div>*/}
        
        
     {/* </div> */}
            </div>
            </div>
           
     );
      })
    }
if(this.state.enableExpModal){
  const today=moment().format('MMMM DD,YYYY ');
  console.log(today);
 expModal=(  <div className="grpExpModal"> <Modal
        open={this.state.enableExpModal}
        onClose={this.closeExpModal}
        // aria-labelledby="simple-modal-title"
        // aria-describedby="simple-modal-description"
      >
     <div className="content">
       <div className="popupHeader">
         Add an Expense
         
            <ClearIcon
              className="closePopup"
              onClick={this.closeExpModal}
            />
         </div>
         <div className="grpExpDtls">
           With you and:
           <button type="button" className="groupButton">
             <img          
              className="grpImg"
              alt="splitwise"
              src={splitwise}
            /> 
             All of {this.state.groupDetails.groupId.groupName} <ClearIcon/></button>
         </div>
         <div className="expenseDtls">
             <img          
              className="expImg"
              alt="splitwise"
              src={expense}
            /> 
            <input type="text" className="description" name="description" placeholder="Enter a description"
            onChange={this.changedNewExpenseDesc}/>
            <br/>
          <span className="currency">$</span><input type="text" name="amount" className="expenseAmount" placeholder="0.00"
          onChange={this.changedNewExpenseAmnt}/>
         </div>
         {/* <div className="splitInfo">
     Paid by <button type="button" className="youSplit">you</button> and split <button type="button" className="youSplit">equally</button>
     <br/>
     <div>({this.state.splittedAmount}/person)</div>
     </div>
<button type="button" className="currentDate">{today}</button>
<br/> */}
{/* <div className="grpName">
<button type="button" className="grpNameBtn">{this.state.groupDetails.group_name}</button>
     </div> */}
     <div className="modalButtons">
       <button type="button" className="cancelBtn">Cancel</button>
       <button type="button" className="saveBtnExp" onClick={this.createExpense}>Save</button>
     </div>
     </div>
      </Modal></div>)
}


// if(this.state.comments.length>0)
// {
//  displayComments=  this.state.comments.map((comment)=>{
//    return(
//      <div className="displayComments">
//        <div className="commentHeader">
//          <span style={{fontWeight:'bold'}}>{comment.createdBy}</span> <span>{comment.createdDate}</span>
//          <ClearIcon
//               className="deleteComment"
//               onClick={()=>this.deleteComment(comment)}
//             />
//  </div>
//  {comment.commentDesc}
//      </div>
//    );

//   })
// }


// if(this.state.enableCommentModal)
// {
// const expense=this.state.selectedExpense;
//   commentModal=(  <div className="expCmntModal"> <Modal
//         open={this.state.enableCommentModal}
//         onClose={this.closeCommentModal}
//       >
//      <div className="expCmntContent">
//        <div className="popupHeader">
//          Add Notes and Comments for {expense.expenseDesc}
         
//             <ClearIcon
//               className="closePopup"
//               onClick={this.closeCommentModal}
//             />
//          </div>
//          <div className="comments">
//         <h4 style={{color:'#999',marginTop:'10px'}}>Notes and Comments</h4>
//         {displayComments}
//         <div className="newComment">
//          <textarea style={{ marginLeft:'1px', width:'200px',fontSize:'13px'}} 
//          rows="2" cols="10" placeholder="Add comment"
//          onChange={this.commentChanged} value={this.state.commentDesc}
//          ></textarea>
//          <br/>
//          <button className="postCmntBtn" onClick={this.postComment}>Post</button>
//          </div>
//       </div>
//       </div>
//       </Modal></div>)


//  }
    return (
      <div className="totalGroupExpenses">
        <div className="groupExpenses">
            <div className="groupExpenseHeader">
              <h1>{this.state.groupDetails.groupId.groupName}</h1>
              <div className="expenseSettleButtons">
              <button className="addExpBtn"type="submit" onClick={this.openModal}>Add an Expense</button>
             </div>
         <div>
                {/* <div className="monthDivider">
                 <span>March 2021</span>
             </div> */}
            </div>
             
            {groupExpenses}
            {expModal}
           
            </div>
        </div>
        <div className="right-side" style={{float:'right'}} >
           
           <h2>GROUP EXPENSES</h2>
      {eachCustOweDtls}
        </div>
        </div>
        );
  }
}
export default GroupExpenses;
