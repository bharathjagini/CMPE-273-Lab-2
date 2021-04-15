import { LOGIN, SIGNUP, RESET,CUSTDETAILSUPDATE ,CUSTGRPDETAILSUPDATE,PROFDTLS} from "../constants/action-types";
const initialState = {
  custDetails:{

  },
  userGroupDetailsList:[],
 profileDtls:{
   currencyDtlsList:[],
   langDetailsList:[],
   timezoneDetailsList:[]


 }
};

function rootReducer(state = initialState, action) {
  if (action.type === LOGIN) {
    console.log("processing in reducer",action.payload.custDetails);
    console.log(action);
    return Object.assign({}, state, {
      custDetails: action.payload.custDetails
    });
  } else if (action.type === SIGNUP) {
    console.log("processing in reducer");
    return Object.assign({}, state, {
      custDetails: action.payload.custDetails
    });
  } else if (action.type === RESET) {
    console.log("processing in reducer");
    return Object.assign({}, state, {
      custDetails: {},
    });
  }
  else if(action.type===CUSTDETAILSUPDATE){
      console.log('updated custDetails', action.payload.custDetails)
    return Object.assign({}, state, {
    
      custDetails: action.payload.custDetails
    });
  }
  else if(action.type===CUSTGRPDETAILSUPDATE){
    console.log('prev state',state)
      console.log('updated cust group list', action.payload.userGroupDetailsList)
    return Object.assign({}, state, {
    
      userGroupDetailsList: action.payload.userGroupDetailsList
    });
   
  }
    else if(action.type===PROFDTLS){
    console.log('prev state',state)
      console.log('config dtls list', action.payload.profDtls)
    return Object.assign({}, state, {  
      profileDtls: action.payload.profDtls
    });
   
  }


 console.log('state',state);
  return state;
}

export default rootReducer;
