import { LOGIN, SIGNUP, RESET,CUSTDETAILSUPDATE,CUSTGRPDETAILSUPDATE,PROFDTLS ,RECACTDTLS} from "../constants/action-types";
export function login(payload) {
  console.log("dispatching the login action", payload);
  return { type: LOGIN, payload };
}

export function signup(payload) {
  console.log("dispatching the signup action");
  return { type: SIGNUP, payload };
}

export function reset(payload) {
  console.log("dispatching the reset action");
  return { type: RESET, payload };
}
export function updateCustDetails(payload) {
  console.log("dispatching the update cust details action");
  return { type: CUSTDETAILSUPDATE, payload };
}
export function updateUserGrpList(payload) {
  console.log("dispatching the update cust group details action");
  return { type: CUSTGRPDETAILSUPDATE, payload };
}
export function saveProfDtls(payload) {
  console.log("dispatching the config details action");
  return { type: PROFDTLS, payload };
}
export function saveRecentAct(payload) {
  console.log("dispatching the config details action");
  return { type: RECACTDTLS, payload };
}

