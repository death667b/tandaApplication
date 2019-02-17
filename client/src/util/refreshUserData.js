import axios from 'axios';
import formatShiftRows from './formatShiftRows.js';

const refreshUserData = async sessionId => {
  try {
    let userListResponse, formattedShifts;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': sessionId
    }
    const orgListRespoonse = await axios.get(`http://localhost:3000/organisations`, {headers});
    const userInfoResponse = await axios.get(`http://localhost:3000/users/me`, {headers});
    const allUsersResponse = await axios.get(`http://localhost:3000/users/all`, {headers});
    let shiftRes = {data: []};
    if (userInfoResponse.data.organisationId) {
      userListResponse = await axios.get(`http://localhost:3000/users`, {headers});
      shiftRes = await axios.get(`http://localhost:3000/shifts`, {headers});
      const userOrganisation = orgListRespoonse.data[userInfoResponse.data.organisationId-1];
      formattedShifts = await formatShiftRows(shiftRes.data, userListResponse.data, userOrganisation);
    } else {
      userListResponse = {data: []};
      formattedShifts = [];
    }
    
    const data = {
      userHasAuthenticated: true,
      sessionId: sessionId,
      shifts: formattedShifts,
      rawShifts: shiftRes.data,
      userId: userInfoResponse.data.id,
      users: userListResponse.data,
      allUsers: allUsersResponse.data,
      name: userInfoResponse.data.name,
      email: userInfoResponse.data.email,
      organisationId: userInfoResponse.data.organisationId,
      organisations: orgListRespoonse.data
    }
    
    return data;
  } catch (e) {
    console.log(e)
    alert(e.response.data.error);
  }
}

export default refreshUserData;