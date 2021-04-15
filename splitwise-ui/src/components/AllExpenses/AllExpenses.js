import React, { Component } from "react";
import "./AllExpenses.css";
import axios from 'axios';
import expenseDefault from "../../assets/images/expense-desc.png";
import numeral from 'numeral';
import moment from 'moment';
import config from '../../config.json';
import cookie from "react-cookies";
class AllExpenses extends Component{
 constructor(props)
 {
     console.log('dummy')
     super(props);
     this.state={
               custDetails: this.props.custDetails,
  //    groupDetails: this.props.location.allExpenses.groupDetails,
      allExpenses: []


     }
 }   
  componentDidMount() {
    const custId=this.state.custDetails.custId;
    //const groupId=this.state.groupDetails.group_id;
    axios
      .get(
        config.backEndURL+"/profile/allExpenses/"+custId
      )

      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
      //    console.log(response.data);
          this.setState({
            allExpenses: response.data,

          });
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
 
 render(){

 let allExpenses=null;
    let lent=null;
     let paid=null;
    console.log(this.state.allExpenses);
    if(this.state.allExpenses.length>0)
    {
     // console.log('asdf');
      allExpenses=this.state.allExpenses.map((expense,index)=>{
const d=moment(expense.created_date)
const month=moment(d.month()+1,'MM').format('MMMM')
const day=d.format("DD");
//const dummy=d.
        const groupSize=1;
        const currencyNumber=numeral(expense.amount).format("$0.00");
        const dividedAmount=numeral(expense.amount/groupSize).format("$0.00");
       console.log(this.state.custDetails.custName.toUpperCase(),expense.cust_name.toUpperCase());
       const custLent=( <div className='lent'>{expense.cust_name} lent you <br/><span className='negative'>{dividedAmount}  </span></div>);
       const otherCustLent=(<div className='lent'>you lent<br/><span className='positive'>{dividedAmount}  </span></div>);
        lent=this.state.custDetails.custName.trim().toUpperCase()===expense.cust_name.trim().toUpperCase() ?otherCustLent:custLent;
       const custPaid=( <div className="paid">
              you paid
              <br/>
             <span className="amount">{currencyNumber}  </span>
          </div>
          );
       const otherCustPaid=(<div className="paid">
               {expense.cust_name} paid
              <br/>
             <span className="amount">{currencyNumber}  </span>
          </div>);
        paid=this.state.custDetails.custName.trim().toUpperCase()===expense.cust_name.trim().toUpperCase() ?custPaid:otherCustPaid;
       
        return (
          
          <div className="flex-item" key={expense.expense_id}>
          
          <div className="expense-grid-container">
          <div className="expenseDesc">
         <div className="expDate">
             {month.substring(0,3)}
            <div className="expDay">
             {/* {day} */}
            </div>
             </div>
          <img  className="expImg" alt="splitwise" src={expenseDefault}/>
            <span>{expense.expense_desc}</span>
             </div>
             <div className="expense">
        
            {paid}  
             {lent} 
          
            {/* <div className="lent">
              {groupExpense.cust_name} lent you
              <br/>
             <span className="negative">{dividedAmount}  </span>
          </div>           */}
     </div>
            </div>
            </div>
           
     );
      })
    }

     return(   
          <div className="allExpenses">
            <div className="allExpenseHeader">
              <h1>All Expenses</h1>
              <div className="expenseSettleButtons">
              <button type="submit">Add an Expense</button>
              <button type="submit">Settle Up 
             
             </button>
            </div>
            <div className="monthDivider">
                 <span>March 2021</span>
             </div>
            
            {allExpenses}
            </div>
           
        </div>)
 }
}
export default AllExpenses;