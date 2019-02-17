import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Routes from "./Routes";
import axios from 'axios';
import TopNavBar from './components/TopNavBar.js';
import { RenderEditUserModal } from './components/Modal.js';

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    const sessionId = localStorage.getItem('sessionId');
    const autoAuthticate = (
      sessionId !== 'null' && 
      sessionId !== null && 
      sessionId !== 'undefined' &&
      sessionId !== undefined) ? true : false;

    this.state = {
      isAuthenticated: autoAuthticate,
      organisations: [],
      organisationId: null,
      shifts: [],
      rawShifts: [],
      userId: null,
      users: [],
      sessionId: sessionId,
      show: false,
      name: "",
      email: "",
      newEmail: "",
      newName: "",
      oldPassword: "",
      newPassword: "",
      newConfirmPassword: ""
    };
  }

  componentWillMount() {
    if(this.state.isAuthenticated && this.state.sessionId !== 'null' && this.state.sessionId !== 'undefined') {
      this.refreshUserData(this.state.sessionId);
    }
  }

  refreshUserData = async sessionId => {
    try {
      let userListResponse, formattedShifts;

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': sessionId
      }
      const orgListRespoonse = await axios.get(`http://localhost:3000/organisations`, {headers});
      const userInfoResponse = await axios.get(`http://localhost:3000/users/me`, {headers});
      let shiftRes = {data: []};
      if (userInfoResponse.data.organisationId) {
        userListResponse = await axios.get(`http://localhost:3000/users`, {headers});
        shiftRes = await axios.get(`http://localhost:3000/shifts`, {headers});
        const userOrganisation = orgListRespoonse.data[userInfoResponse.data.organisationId-1];
        formattedShifts = await this.formatShiftRows(shiftRes.data, userListResponse.data, userOrganisation);
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
        name: userInfoResponse.data.name,
        email: userInfoResponse.data.email,
        organisationId: userInfoResponse.data.organisationId,
        organisations: orgListRespoonse.data
      }
      
      this.userHasAuthenticated(data);
    } catch (e) {
      console.log(e)
      alert(e.response.data.error);
    }
  }

  formatShiftRows = async (rawShiftData, userData, userOrg) => {
    const formattedData = [];
    const hourlyRate = userOrg.hourlyRate;


    rawShiftData.forEach(shift => {
      const name = userData.filter(user => user.id === shift.userId)[0].name;
      const startDateObj = new Date(shift.start);
      const finsihDateObj = new Date(shift.finish);
      const shiftDate = startDateObj.getDate() + '/' + startDateObj.getMonth() + '/' + startDateObj.getFullYear();
      const startTime = startDateObj.getHours() + ':' + startDateObj.getMinutes();
      const finishTime = finsihDateObj.getHours() + ':' + finsihDateObj.getMinutes();
      const breakLength = shift.breakLength;
      const hoursWorkedMinutes = (finsihDateObj-startDateObj)/1000/60;
      const hoursWorked = (hoursWorkedMinutes-breakLength >= 0) ?
        ((hoursWorkedMinutes-breakLength)/60).toFixed(2) :
        0;
      const shiftCost = hourlyRate * hoursWorked;

      const newShift = {
        id: shift.id,
        name,
        shiftDate,
        startTime,
        finishTime,
        breakLength: 10,
        hoursWorked,
        shiftCost
      }
      formattedData.push(newShift);
    })
    return formattedData;
  }

  getOrganisationData = sessId => {
    const sessionId = sessId || this.state.sessionId;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': sessionId
    }

    try {
      axios.get(`http://localhost:3000/organisations`, {headers})
        .then(res => {
          this.setState({ 
            organisations: res.data
          });
        })
    } catch (e) {
      alert(e.response.data.error);
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  userHasChangedOrganisation = orgId => {
    this.setState({
      organisationId: orgId
    });
  }

  updateOrganisation = organisations => {
    this.setState({
      organisations
    });
  }

  updateOrganisationAndUserId = async (orgId, newOrgArray, newRawShifts, newUserList) => {
    const userOrganisation = newOrgArray[orgId-1];
    const rawShifts = newRawShifts || this.state.rawShifts;
    const users = newUserList || this.state.users;
    this.formatShiftRows(rawShifts, users, userOrganisation)
      .then(shifts => {
        this.setState({
          organisationId: orgId,
          organisations: newOrgArray,
          shifts,
          rawShifts,
          users
        });
      })
  }

  userHasAuthenticated = (data) => {
    // Get all the details of the user if there is a sessionId
    if (data.userHasAuthenticated && data.sessionId !== 'null' && data.sessionId !== 'undefined') {
      localStorage.setItem('sessionId', data.sessionId);

      console.log(data)

      this.setState({ 
        isAuthenticated: data.userHasAuthenticated,
        sessionId: data.sessionId,
        shifts: data.shifts,
        rawShifts: data.rawShifts,
        userId: data.id,
        users: data.users,
        name: data.name,
        email: data.email,
        organisationId: data.organisationId,
        organisations: data.organisations
      });
    } else {
      localStorage.removeItem('sessionId');

      this.setState({ 
        isAuthenticated: false,
        sessionId: null
      });
    }
  }

  handleLogout = async event => {
    const data = {
      userHasAuthenticated: false,
      sessionId: undefined,
      email: ""
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': this.state.sessionId
    }

    try {
      await axios.delete(`http://localhost:3000/auth/logout`, {headers, data})
        .then(res => {
          this.userHasAuthenticated(data);
          this.props.history.push("/login");
        })
    } catch (e) {
      alert(e.message);
    }
  }

  handleModalClose = () => {
    this.setState({ 
      show: false,      
      newPassword: "",
      newConfirmPassword: "" ,
      newName: "",
      newEmail: ""
    });
  }

  handleModalShow = () => {
    this.setState({ show: true });
  }

  validateModalRenameForm = () => {
    return (
      this.state.newEmail.length > 0 ||
      this.state.newName.length > 0
    );
  }

  validateModelPasswordForm = () => {
    return (
      this.state.oldPassword.length > 0 &&
      this.state.newPassword.length > 0 &&
      this.state.newPassword === this.state.newConfirmPassword
    );
  }

  handleModalRenameSubmit = async event => {
    event.preventDefault();

    const updateUser = {
      name: this.state.newName || this.state.name,
      email: this.state.newEmail || this.state.email
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': this.state.sessionId
    }

    try {
      await axios.put(`http://localhost:3000/users/me`, updateUser, {headers})
        .then(res => {
          this.setState({ 
            name: res.data.name,
            email: res.data.email,
            show: false
          });
        })
    } catch (e) {
      alert(e.response.data.error);
    }
  }

  handleModalPasswordSubmit = async event => {
    event.preventDefault();

    const updatePassword = {
      oldPassword: this.state.oldPassword,
      newPassword: this.state.newPassword,
      newPasswordConfirmation: this.state.newConfirmPassword
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': this.state.sessionId
    }

    try {
      await axios.put(`http://localhost:3000/users/me/change_password`, updatePassword, {headers})
        .then(res => {
          this.setState({ 
            oldPassword: "",
            newPassword: "",
            newConfirmPassword: "",
            show: false
          });
        })
    } catch (e) {
      alert(e.response.data.error);
    }
  }

render() {
  const childProps = {
    isAuthenticated: this.state.isAuthenticated,
    sessionId: this.state.sessionId,
    userHasAuthenticated: this.userHasAuthenticated,
    userHasChangedOrganisation: this.userHasChangedOrganisation,
    updateOrganisationAndUserId: this.updateOrganisationAndUserId,
    updateOrganisation: this.updateOrganisation,
    getOrganisationData: this.getOrganisationData,
    formatShiftRows: this.formatShiftRows,
    userId: this.state.userId,
    name: this.state.name,
    email: this.state.email,
    organisationId: this.state.organisationId,
    organisations: this.state.organisations,
    shifts: this.state.shifts
  };

  const narBarProps = {
    handleModalShow: this.handleModalShow,
    handleLogout: this.handleLogout,
    isAuthenticated: this.state.isAuthenticated
  }

  const modalProps = {
    show: this.state.show,
    name: this.state.name,
    newName: this.state.newName,
    email: this.state.email,
    newEmail: this.state.newEmail,
    oldPassword: this.state.oldPassword,
    newPassword: this.state.newPassword,
    newConfirmPassword: this.state.newConfirmPassword,
    handleChange: this.handleChange,
    handleModalClose: this.handleModalClose,
    handleModalRenameSubmit: this.handleModalRenameSubmit,
    handleModalPasswordSubmit: this.handleModalPasswordSubmit,
    validateModalRenameForm: this.validateModalRenameForm,
    validateModelPasswordForm: this.validateModelPasswordForm,
  }

  return (
    <div className="App container">
      <TopNavBar props={narBarProps}/>
      <Routes childProps={childProps} />

      <RenderEditUserModal props={modalProps}/>
    </div>
  );
}
}

export default withRouter(App);