import React,{Component} from 'react';
import "./MyProfile.css";
import CreateIcon from '@material-ui/icons/Create';
import axios from 'axios';
import { Redirect } from "react-router";
import config from '../../config.json';
import cookie from "react-cookies";
import { connect } from "react-redux";
import {saveProfDtls}  from "../../redux/actions/index";
import HomePageR from "../HomePage/HomePage"

class MyProfile extends Component{
constructor(props)
{
      console.log(props);
    super(props);
    this.state={
      
        custDetails:this.props.custDetails,
        enableNameText:false,
        enableEmailText:false,
        enablePhnNmber:false,
        enablePasswd:false,
        currencyDtlsList:this.props.profDtls.currencyDtlsList,
        langDetailsList:this.props.profDtls.langDetailsList,
        timezoneDetailsList:this.props.profDtls.timezoneDetailsList,
        detailsUpdated:false,
        imageUri:"",
        imageData:this.props.custDetails.image,
        selectedFile:[],
        imageUploaded:false,
        updatedCustdetails:{
            custId:this.props.custDetails.custId,
            custName:this.props.custDetails.custName,
            custEmail:this.props.custDetails.loginUserId,
            custPhnNmbr:this.props.custDetails.phnNumber,
            currPasswd:"",
            newPasswd:"",
            currencyId:this.props.custDetails.currencyId,
            timezoneId:this.props.custDetails.timezoneId,
            languageId:this.props.custDetails.languageId,
            image:this.props.custDetails.image,
            imageUploaded:false
}

        }      
        }

        
enableNameEdit=()=>{
    this.setState({
        enableNameText:true
    })
}
enableEmailEdit=()=>{
    this.setState({
        enableEmailText:true
    })
}
enablePhnNmberEdit=()=>{
    this.setState({
        enablePhnNmber:true
    })
}
enablePasswdEdit=()=>{
    this.setState({
        enablePasswd:true
    })
}
currentPasswordChanged=(e)=>{
    let updatedCustDetails=this.state.updatedCustdetails;
    updatedCustDetails.currPasswd=e.target.value;
    this.setState({
    updatedCustDetails:updatedCustDetails
    })
}
newPasswordChanged=(e)=>{
    let updatedCustDetails=this.state.updatedCustdetails;
    updatedCustDetails.newPasswd=e.target.value;
    this.setState({
    updatedCustDetails:updatedCustDetails
    })
}
custNameChanged=(e)=>{
  console.log('qwer')
let updatedCustDetails=this.state.updatedCustdetails;
    updatedCustDetails.custName=e.target.value;
    let custDetails=this.state.custDetails;
    custDetails.custName=e.target.value;
    this.setState({
    updatedCustDetails:updatedCustDetails,
    custDetails:custDetails
    })
}
phnNumberChanged=(e)=>{
let updatedCustDetails=this.state.updatedCustdetails;
    updatedCustDetails.custPhnNmbr=e.target.value;
    let custDetails=this.state.custDetails;
    custDetails.phnNumber=e.target.value;
    
    this.setState({
    updatedCustDetails:updatedCustDetails,
    custDetails:custDetails
    })
}
custEmailChanged=(e)=>{
let updatedCustDetails=this.state.updatedCustdetails;
    updatedCustDetails.custEmail=e.target.value;
    this.setState({
    updatedCustDetails:updatedCustDetails
    })
}
currencyChanged=(e)=>{
let updatedCustDetails=this.state.updatedCustdetails;
    updatedCustDetails.currencyId=Number(e.target.value);

    this.setState({
    updatedCustDetails:updatedCustDetails
    })
}
languageChanged=(e)=>{
let updatedCustDetails=this.state.updatedCustdetails;
    updatedCustDetails.languageId=e.target.value;
    this.setState({
    updatedCustDetails:updatedCustDetails
    })
}
timezoneChanged=(e)=>{
let updatedCustDetails=this.state.updatedCustdetails;
    updatedCustDetails.timezoneId=Number(e.target.value);
    this.setState({
    updatedCustDetails:updatedCustDetails
    })
}

componentDidMount(){
 // this.getImage();
     const custId=this.state.custDetails.custId;
    //const groupId=this.state.groupDetails.group_id;
    console.log('curr dtls from store',this.state.currencyDtlsList)
    if(this.state.currencyDtlsList.length>0) return;
    axios
      .get(
        config.backEndURL+"/users/configDtls"
      )

      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          console.log(response.data);
          this.setState({
            currencyDtlsList:response.data.currencyDtlsList,
            langDetailsList:response.data.langDetailsList,
            timezoneDetailsList:response.data.timezoneDetailsList
          });
          const profDtls=response.data;
          this.props.fetchedProfDtls({profDtls:profDtls});
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
uploadImageinDB=()=>{
  return new Promise((resolve,reject)=>{
  const custId=this.state.custDetails.custId; 
    const formData = new FormData();
    
    console.log(this.state.updatedCustdetails);
      // Update the formData object
    console.log(this.state.selectedFile)
      formData.append(
        "file",
        this.state.selectedFile
     
      ); 
      formData.append("profDtls",JSON.stringify(this.state.updatedCustdetails));
      const config1 = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
  axios
      .post(
        config.backEndURL+"/users/updateProfDtls/"+custId,formData,config1
      )

      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
       
          let updatedCustdetails=this.state.custDetails;
          updatedCustdetails.custPhnNmbr=response.data.custPhoneNumber;
         console.log(response.data)
 
         if(this.state.imageUploaded){
          updatedCustdetails.image=response.data.image;
          this.setState({
            imageData:response.data.image,
            updatedCustdetails:updatedCustdetails
          })
        }
        //  this.props.custDetailsUpdated({
        //   updatedCustdetails:updatedCustdetails
        // });
        return resolve(updatedCustdetails);
          //console.log(this.state);
        }
        else{

        }
      })
      .catch(error => {
    
        console.log(error.response);
            return reject('unknown error')
      });
})
}
getImage=()=>{
  const imageId=this.state.custDetails.imageId;
  if(imageId!==null){
    axios
      .get(
        config.backEndURL+"/profile/image/"+imageId
      )

      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          console.log(response.data);
          const base64String = "data:image/png;base64,"+response.data.imageData;
          console.log(base64String)
          const img = new Buffer.from(response.data.imageData).toString("ascii");
         const converted="data:image/png;base64,"+img;
//          console.log(img)
          this.setState({
            imageData:converted
          })
          var reader = new FileReader();
 reader.readAsDataURL(img); 
 reader.onloadend = function() {
     var base64data = reader.result; 
      
     console.log(base64data)              
    this.setState({
            imageData:base64data
          });
 }
        
          //console.log(this.state);
        }
        else{

        }
      })
      .catch(error => {
        console.log(error.response);
      });
    }
}

updateCustdetails=async ()=>{
 
 const updatedCustDetails=await this.uploadImageinDB();
  // const imageData=this.state.imageUri;
  // const custDetails=this.state.updateCustdetails;
  // custDetails.imageData=imageData;
  // this.setState({
  //   updateCustdetails:custDetails
  // })
//  const updatedCustDetails=await this.saveCustDetailsinDB();
//  if(imageId!==null)
//  {
//    console.log('imgId')
//     updatedCustDetails.imageId=imageId;
//  }
 console.log('after db update',updatedCustDetails)
  this.props.custDetailsUpdated({
          updatedCustdetails:updatedCustDetails
        });
        this.props.history.push("/");
}
saveCustDetailsinDB=()=>{
  return new Promise((resolve,reject)=>{
    axios
      .put(
        config.backEndURL+"/profile/custDetails",this.state.updatedCustdetails
      )

      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
        console.log(response);
        this.setState({
          detailsUpdated:true
        })
          console.log(response.data);
         //need to update custDetails props
        const updatedCustdetails=this.state.updatedCustdetails;
        return resolve(updatedCustdetails)
        //console.log('updated details',updatedCustdetails)

        //     this.setState({
        //    updatedCustdetails:updatedCustdetails
        //  })
        //
          
      //console.log(this.state);
     
         
          // this.props.history.push({pathname: "/home",
          // updatedCustdetails:{updatedCustdetails:updatedCustdetails}});
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
componentDidUpdate(prevState,prevProps){
  if(this.state.updatedCustdetails.currencyId!==prevState.currencyId)
  {
    console.log('changed')
  }

}
uploadedImage=(event)=>{
  console.log('asd',event.target.files[0]);
  //let newFile=file;
  const file=event.target.files[0];
  console.log(file)
  this.setState({
    selectedFile:file
  })
  console.log(this.state.selectedFile);
 const reader = new FileReader();
     reader.onload = (event) => {
//  console.log(typeof event.target.result)
 


       this.setState({
        imageData:event.target.result,
        imageUploaded:true
      })
     };
     reader.readAsDataURL(file);
     
}

render(){
let redirect=null;
  if(this.state.detailsUpdated)
  {
//redirect = <Redirect to="/home" />;
this.props.history.push("/home")
  }
     let custNameEdit=null;
     let custEmailEdit=null;
     let custPhnEdit=null;
     let custPasswdEdit=null;
     let currencyDtls=null;
     let timezoneDtls=null;
     let langDtls=null;
    // let countryCodes=null;
     const phnNumber=this.state.custDetails.phnNumber?this.state.custDetails.phnNumber:'None';
if(!this.state.enableNameText)
custNameEdit=( <span className="editDetails" onClick={this.enableNameEdit} ><span style={{color:'black',fontWeight:'bold'}}>{this.state.custDetails.custName}</span><CreateIcon/>edit</span>);
else
custNameEdit=( <input type="text" onChange={this.custNameChanged} value={this.state.custDetails.custName}/>);
if(!this.state.enableEmailText)    
custEmailEdit=( <span className="editDetails" onClick={this.enableEmailEdit} ><span style={{color:'black',fontWeight:'bold'}}><span style={{color:'black',fontWeight:'bold'}}>{this.state.custDetails.loginUserId}</span></span><CreateIcon/>edit</span>);
else
custEmailEdit=( <input type="text" onChange={this.custEmailChanged} value={this.state.custDetails.loginUserId}/>);
if(!this.state.enablePhnNmber)    
custPhnEdit=( <span className="editDetails" onClick={this.enablePhnNmberEdit} ><span style={{color:'black',fontWeight:'bold'}}>{phnNumber}</span><CreateIcon/>edit</span>);
else
custPhnEdit=(<input type="text" value={this.state.custDetails.phnNumber} onChange={this.phnNumberChanged}  pattern="[0-9]{10}"/>);

if(!this.state.enablePasswd)
custPasswdEdit=(<div>Your password<br/><span className="editDetails" onClick={this.enablePasswdEdit} ><span style={{color:'black',fontWeight:'bold',fontSize:'20px'}}>••••••••••</span><CreateIcon/>edit</span></div>);
else
custPasswdEdit=(<div className="changePasswd"> <span>Your current password</span><input type="text" onChange={this.currentPasswordChanged} name="currPasswd"/><br/><span>Your new password</span> <input type="text" onChange={this.newPasswordChanged} name="newPasswd"/></div>);

//if(this.state.currencyDtlsList.length>0){
 currencyDtls=this.state.currencyDtlsList.map(currency=>{
  return(
      <option value={currency._id}>{currency.currencyName}</option>
  );  
})
timezoneDtls=this.state.timezoneDetailsList.map(timezone=>{
    return(
         <option value={timezone._id}>{timezone.timezoneName}</option>
    );
})
langDtls=this.state.langDetailsList.map(lang=>{
    return(
         <option value={lang._id}>{lang.languageName}</option>
    );
})
// countryCodes=this.state.countryCodesList.map(countryCode=>{
//   return(
//       <option value={currency.currencyId}>{currency.currencyName}</option>
//   );  
// })
//}
return(
    <div >
{/* <form> */}
   <div className="profileGridContainer">
        <div className="imageSection">
            <h1>Your account</h1>
           
             <img width="200" height="200" src={this.state.imageData} alt="Profile"/>
            <input type="file"  title="Profile" onChange={event => this.uploadedImage(event)} />
        </div>
        <div className="personalDetailsSection">
               <div className="editName">
            <span>Your name</span>
        
          </div>
             {custNameEdit}
           <div className="editEmail">
            <span>Your email address</span>

            </div>
           {custEmailEdit}            
        
        <div className="editPhn">
            <span>Your Phone number</span>
             
            </div>
                    {/* <select className="drpdwn" value={this.state.updatedCustdetails.countryCode}
             onChange={this.countryCodeChanged}>
                {countryCodeList} 
             </select> */}

             {custPhnEdit}
        {/* <div className="changePasswd">
            
              
            </div>
            {custPasswdEdit} */}
            
        </div>
        <div className="configSection">
             <span>Your default currency</span>
             <br/> 
             <span className="newExp">(for new expenses)</span>
             <br/>
             <select className="drpdwn" value={this.state.updatedCustdetails.currencyId}
             onChange={this.currencyChanged}>
                {currencyDtls} 
             </select>
             <div className="selectTimezone" value={this.state.updatedCustdetails.timezoneId}
              onChange={this.timezoneChanged}>
            <span>Your timezone</span>
            <select className="drpdwn">
                {timezoneDtls} 
             </select>
            </div>
             <div className="language">
            <span>Language</span><br/>
            <select className="drpdwn" value={this.state.updatedCustdetails.languageId}
             onChange={this.languageChanged}>
                {langDtls} 
             </select>
            </div> 
            <button className="saveBtn" onClick={this.updateCustdetails}>Save</button>                          
        </div>
        </div>
        {/* </form> */}
    </div>);
}
}


function mapDispatchToProps(dispatch) {
  console.log('in dispatch')
  return ({
  
    saveProfDtls:profDtls=>dispatch(saveProfDtls(profDtls)),
    
  });
}
export default connect(null,mapDispatchToProps)(MyProfile);

//export default MyProfile;
