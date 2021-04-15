import React, { Component } from "react";
import "./DashboardExpSummary.css";
import numeral from 'numeral';
import config from '../../../config.json';
import cookie from "react-cookies";
class DashboardExpSummary extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      oweDetails:this.props.oweDetails,
      custDetails:this.props.custDetails
    };
  }
  componentDidUpdate(prevProps)
  {
    console.log(prevProps)
    console.log(this.props);
    if(prevProps.oweDetails!==this.props.oweDetails){
    this.setState({
      oweDetails:this.props.oweDetails
    })
  }
  }
  render() {

  let totalExpense=null;
  let custOweDetails=null;
   let otherCustOweDetails=null;
   let custOweDetails1=null;
   let otherCustOweDetails1=null;
  let custOwe=null;
  let otherCustOwe=null;
  let headerOweAmnt=0;
  let headerOwedAmnt=0;
  
  const currency=this.state.custDetails.currencyValue;
 let oweAmount=( <span class="neutral">{currency} 0.00</span>)
  let paidAmount=( <span class="neutral">{currency} 0.00</span>);
 // let oweAmount=currency+" 0.00";
  let totalBlnc=this.state.oweDetails.loggedInCustPaidAmount-this.state.oweDetails.loggedInCustOweAmount;

  const totalexp=this.state.oweDetails.loggedInCustPaidAmount-this.state.oweDetails.loggedInCustOweAmount;
  if(totalBlnc>0)
  {
    totalBlnc=numeral(totalBlnc).format("0.00")

  paidAmount=( <span class="positive">{currency} {totalBlnc}</span>)
   totalExpense=(<span className="positive">{currency} {totalBlnc}</span>);
  }
  else if(totalBlnc===0)
  {
    totalBlnc=numeral(totalBlnc).format("0.00")
  paidAmount=( <span class="neutral">{currency} {totalBlnc}</span>)
   totalExpense=(<span className="neutral">{currency} {totalBlnc}</span>);    
  }
  else 
  {
      totalBlnc=numeral(totalBlnc).format("0.00")
  oweAmount=( <span class="negative">{currency} {totalBlnc}</span>)
  totalExpense=(<span className="negative">{currency} {totalBlnc}</span>);
  }
  console.log('total exp',totalexp)
  
  if(this.state.oweDetails.eachCustOweList.length>0)
  {
  
    otherCustOweDetails=this.state.oweDetails.eachCustOweList.map((eachCust,index)=>{
     //otherCustOwe=null;
     // custOwe=null;
      if(eachCust.amount>0){
          headerOwedAmnt=headerOwedAmnt+Number(eachCust.amount);
 otherCustOwe=(<div className="flexItem"><span style={{color:'#000',fontWeight:'bold',fontSize:'16px'}}>{eachCust.custName}</span><br/><span style={{color:'#5bc5a7'}}>owes you {eachCust.amount} </span></div>)
     }
      return(
        <div>
          {otherCustOwe}
        </div>
      )
    })
  }
  if(this.state.oweDetails.eachCustOweList.length>0)
  {
    
    custOweDetails=this.state.oweDetails.eachCustOweList.map((eachCust,index)=>{
      if(eachCust.amount<0){
        headerOweAmnt=headerOweAmnt+Number(eachCust.amount);
  const  absValue= numeral(Math.abs(eachCust.amount)).format("0.00");
  custOwe=(  <div className="flexItem"><span style={{color:'#000',fontWeight:'bold',fontSize:'16px'}}>{eachCust.custName}</span><br/>
 <span style={{color:'#ff652f'}}>you owe {currency} {absValue} </span></div>)
  return (
    <div key={index}>
    {custOwe}
    </div>
  ); 
  }
    })
  }
console.log('owed::',headerOwedAmnt)
  let headerTotalExp=headerOwedAmnt+headerOweAmnt;
  
 let headerOwedAmntSpan=null;
 let headerOweAmntSpan=null;
 let headerTotalExpSpan=null;
 if(headerTotalExp===null)
 headerTotalExpSpan=( <span class="neutral">{currency} 0.00</span>);
  if(headerTotalExp===0)
  {
  headerOwedAmntSpan=( <span class="neutral">{currency} 0.00</span>)
  headerOweAmntSpan=( <span class="neutral">{currency} 0.00</span>);
  headerTotalExpSpan=( <span class="neutral">{currency} 0.00</span>);

  }
  if(headerTotalExp>0){
    headerTotalExp=numeral(headerTotalExp).format("0.00");
   headerTotalExpSpan=( <span class="positive">{currency} {headerTotalExp}</span>);
  }
   else if(headerTotalExp<0){
      headerTotalExp=numeral(headerTotalExp).format("0.00");
    headerTotalExpSpan=( <span class="negative">{currency} {headerTotalExp}</span>);
   }
  if(headerOwedAmnt===0){
   headerOwedAmntSpan=( <span class="neutral">{currency} 0.00</span>);
  }
   else{
      headerOwedAmnt=numeral(headerOwedAmnt).format("0.00");
    headerOwedAmntSpan=( <span class="positive">{currency} {headerOwedAmnt}</span>);
   }
    if(headerOweAmnt===0){
      headerOweAmntSpan=( <span class="neutral">{currency} 0.00</span>);
    }
else{
  headerOweAmnt=numeral(headerOweAmnt).format("0.00");
 headerOweAmntSpan=( <span class="negative">{currency} {headerOweAmnt}</span>);
} 
 headerOwedAmnt=numeral(headerOwedAmnt).format("0.00");
  headerOweAmnt=numeral(headerOweAmnt).format("0.00");
  const doNotOwe=(<h2>You do not owe anything</h2>);
const notOwed=(<h2>You are not owed anything</h2>);
  if(otherCustOweDetails!==null &&custOweDetails!==null){
  const filter=custOweDetails.filter(owe=> owe===undefined);
   const filter1=otherCustOweDetails.filter(owe=> owe===undefined);
 
console.log('count:'+filter.length)
custOweDetails1=filter.length!==custOweDetails.length ? custOweDetails :doNotOwe
  
otherCustOweDetails1=filter1.length!==otherCustOweDetails.length ? otherCustOweDetails:notOwed
  }
  else
  {
    custOweDetails1=doNotOwe;
    otherCustOweDetails1=notOwed;

  }
  return (
      <div className="dashboard-expenses">
        <div className="totalBalances">
          <div className="balance_summary">
            <div className="block">
              <div className="title">total balance</div>
              {headerTotalExpSpan}
                 {/* {totalExpense} */}
              {/* <span class="positive">{totalexp}</span> */}
            </div>
            <div className="block">
              <div className="title">you owe</div>
             {headerOweAmntSpan}
             {/* {oweAmount} */}
            </div>
            <div className="block">
              <div className="title">you are owed</div>
              {headerOwedAmntSpan}
              {/* {paidAmount} */}
            </div>
          </div>                 
            {/* <div className="oweContainer"> */}
             {/* <span className="youOwe"> YOU OWE</span> */}
                {/* <span className="youOwe"> YOU OWE</span>
                 <span className="youOwed">YOU ARE OWED</span> */}
              {/* <div className="oweFlexContainer">
             <span className="youOwe"> YOU OWE</span>
             {custOwe}
             </div>
             <div className="owedFlexContainer">
            <span className="youOwed">YOU ARE OWED</span>
            {otherCustOwe}
  </div>     */}
  <div className="oweContainer"> 
  
      <div className="owe">  
      <h2 style={{fontWeight:'bold'}}>YOU OWE</h2>                    
             {custOweDetails1}     
             </div>
      
       <div className="owed">
       <h2 style={{fontWeight:'bold'}}>YOU ARE OWED</h2>   
            {otherCustOweDetails1}
            </div>      
           
             

               {/* {custOweDetails} */}
               </div>
                  {/* </div> */}
           
           
        </div>
      </div>
    );
  }
}
export default DashboardExpSummary;
