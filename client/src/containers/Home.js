import React, { Component } from "react";
import { Button, ButtonToolbar } from 'react-bootstrap'
import axios from 'axios';
import { 
  RenderEditOrgModal, 
  RenderCreateJoinOrgModal, 
  RenderLeaveOrgModal,
  RenderNewShiftModal } from '../components/Modal.js';
import ListOrganisations from '../components/ListOrganisations.js';
import ListShifts from '../components/ListShifts.js';
import currencyFormatted from '../util/currencyFormatted.js';
import cleanHourlyRate from '../util/cleanHourlyRate.js';
import calcHoursWorked from '../util/calcHoursWorked.js';
import formatTime from '../util/formatTime.js';
import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showEditModal: false,
      showCreateJoinModal: false,
      showLeaveModal: false,
      showNewShiftModal: false,
      newName: '',
      newHourlyRate: '',
      orgId: '',
      orgName: '',
      breakTime: 0,
      hoursWorked: 0,
      shiftCost: 0,
      selectedOption: null,
      selectedOptionId: null,
      startDate: new Date(),
      finishDate: new Date(),
    };
  }

  validateOrgModalForm = () => {
    return (
      this.state.newName.length > 0 &&
      cleanHourlyRate(this.state.newHourlyRate)
    );
  }

  validateNewShiftModalForm = () => {
    const { startDate, finishDate, breakTime } = this.state;
    let hourlyRate;
    if (this.state.showNewShiftModal && this.props.organisations.length > 0) {
      hourlyRate = this.props.organisations[this.props.organisationId-1].hourlyRate
    } else {
      hourlyRate = 0;
    }
    const { hoursWorked } = calcHoursWorked(startDate, finishDate, breakTime, hourlyRate);

    return (
      breakTime >= 0 &&
      hoursWorked > 0
    );
  }

  handleDropdownOptionChange = (user) => {
    this.setState({ 
      selectedOption: user.name,
      selectedOptionId: user.id
    });
  }

  HandleJoinSubmit = async orgId => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': this.props.sessionId
    }

    const data = {
        "organisationId": orgId
      }

    try {
      await axios.post(`http://localhost:3000/organisations/join`, data, {headers})
      const userListRes = await axios.get(`http://localhost:3000/users`, {headers});
      const shiftRes = await axios.get(`http://localhost:3000/shifts`, {headers});

      this.props.updateOrganisationAndUserId(orgId, this.props.organisations, shiftRes.data, userListRes.data);

    } catch (e) {
      alert(e.response.data.error);
    }
  }

  handleModalClose = () => {
    this.setState({ 
      showEditModal: false,
      showCreateJoinModal: false,
      showLeaveModal: false,
      showNewShiftModal: false,
      newName: '',
      newHourlyRate: '',
    });
  }

  handleEditModalShow = row => {
    const {id, name, hourlyRate} = row;

    this.setState({ 
      showEditModal: true,
      orgId: id,
      orgName: name,
      newName: name,
      newHourlyRate: hourlyRate
    });
  }
  
  handleStartDataChange = startDate => {
    let { finishDate, breakTime } = this.state;
    if(finishDate < startDate) finishDate = startDate;
    const hourlyRate = this.props.organisations[this.props.organisationId-1].hourlyRate;
    const { hoursWorked, shiftCost } = calcHoursWorked(startDate, finishDate, breakTime, hourlyRate);

      this.setState({ 
        startDate,
        finishDate,
        hoursWorked,
        shiftCost
      });
  }

  handleFinishDataChange = finishDate => {
    const { startDate, breakTime } = this.state;
    const hourlyRate = this.props.organisations[this.props.organisationId-1].hourlyRate;
    const { hoursWorked, shiftCost } = calcHoursWorked(startDate, finishDate, breakTime, hourlyRate);

      this.setState({ 
        finishDate,
        hoursWorked,
        shiftCost
      });
  }

  handleBreakTimeChange = dirtyBreakTime => {
    let breakTime = parseInt(dirtyBreakTime.target.value);
    breakTime = (isNaN(breakTime) || breakTime < 0) ? 0 : breakTime;
    const hourlyRate = this.props.organisations[this.props.organisationId-1].hourlyRate;
    const { startDate, finishDate } = this.state;
    const { hoursWorked, shiftCost } = calcHoursWorked(startDate, finishDate, breakTime, hourlyRate);

      this.setState({ 
        hoursWorked,
        shiftCost,
        breakTime
      });
  }

  handleCreateJoinModalShow = () => {
    this.setState({ 
      showCreateJoinModal: true,
      newName: '',
      newHourlyRate: ''
    });
  }

  handleLeaveModalShow = () => {
    this.setState({ 
      showLeaveModal: true
    });
  }

  handleNewShiftModalShow = () => {
    let currentUser = '';
    (this.props.allUsers.length > 0) && (currentUser = this.props.allUsers[this.props.userId-1]);

    this.setState({ 
      showNewShiftModal: true,
      selectedOption: currentUser.name,
      selectedOptionId: currentUser.id,
      startDate: new Date(),
      finishDate: new Date(),
    });
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleOrgUpdateModalSubmit = async event => {
    event.preventDefault();

    const cleanedHourlyRate = cleanHourlyRate(this.state.newHourlyRate);
    const orgId = this.state.orgId;

    const updateOrganisation = {
      name: this.state.newName,
      hourlyRate: cleanedHourlyRate
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': this.props.sessionId
    }

    try {
      await axios.put(`http://localhost:3000/organisations/${orgId}`, updateOrganisation, {headers})
        .then(res => {
          const oldOrg = JSON.parse(JSON.stringify(this.props.organisations))
          oldOrg[orgId-1] = {id: orgId, ...updateOrganisation};

          this.setState({
            showEditModal: false,
            newName: '',
            newHourlyRate: '',
          });

          if(this.props.organisationId) {
            this.props.updateOrganisationAndUserId(orgId, oldOrg);
          } else {
            this.props.updateOrganisation(oldOrg);
          }
          
        })
    } catch (e) {
      alert(e.response.data.error);
    }
  }

  handleAddNewShiftModalSubmit = async event => {
    event.preventDefault();

    const newShift = {
      userId: this.state.selectedOptionId,
      start: formatTime(this.state.startDate),
      finish: formatTime(this.state.finishDate),
      breakLength: this.state.breakTime
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': this.props.sessionId
    }

    try {
      const shiftRes = await axios.post(`http://localhost:3000/shifts`, newShift, {headers})
  
      this.setState({
        showNewShiftModal: false,
        breakTime: 0,
        hoursWorked: 0,
        shiftCost: 0,
      });

      this.props.addNewShift(shiftRes.data);
    } catch (e) {
      console.log(e)
      alert(e.response.data.error);
    }
  }

  handleOrgCreateJoinModalSubmit = async event => {
    event.preventDefault();

    const cleanedHourlyRate = cleanHourlyRate(this.state.newHourlyRate);

    const createOrganisation = {
      name: this.state.newName,
      hourlyRate: cleanedHourlyRate
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': this.props.sessionId
    }

    try {
      const joinRes = await axios.post(`http://localhost:3000/organisations/create_join`, createOrganisation, {headers})
      const orgListRespoonse = await axios.get(`http://localhost:3000/organisations`, {headers});

      this.setState({
        showCreateJoinModal: false,
        newName: '',
        newHourlyRate: '',
      });

      this.props.updateOrganisationAndUserId(joinRes.data.id, orgListRespoonse.data)
    } catch (e) {
      alert(e.response.data.error);
    }
  }

  handleEditShiftModalShow = async row => {

  }

  HandleDeleteShiftSubmit = async shiftId => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': this.props.sessionId
    }

    try {
      await axios.delete(`http://localhost:3000/shifts/${shiftId}`, {headers})
        .then(res => {
          this.props.removeOneShift(shiftId);
        })
    } catch (e) {
      alert(e.response.data.error);
    }
  }

  handleLeaveModalSubmit = async event => {
    event.preventDefault();

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': this.props.sessionId
    }

    try {
      await axios.post(`http://localhost:3000/organisations/leave`, {}, {headers})
        .then(res => {
          this.setState({
            showLeaveModal: false
          });

          this.props.userHasChangedOrganisation(null);
        })
    } catch (e) {
      alert(e.response.data.error);
    }
  }

  renderWelcomePage() {
    return (
      <div className="lander">
        <h1>Adnat</h1>
        <p>A simple roster app</p>
      </div>
    );
  }

  renderNoUserOrganisations() {
    const childProps = {
      organisations: this.props.organisations,
      handleEditModalShow: this.handleEditModalShow,
      HandleJoinSubmit: this.HandleJoinSubmit
    }

    return (
      <div>
        <h3>Organisations</h3>
        <p>
          You are currently not apart of any Organisations. Please join or create one.<br />
          <Button 
            bsStyle="primary" 
            className='joinCreateButton' 
            onClick={this.handleCreateJoinModalShow}
          >
            Create and Join new Organisation
          </Button>
        </p>
        <ListOrganisations props={childProps}/>
      </div>

    )
  }

  renderUsersOrganisations() {
    const userOrganisation = this.props.organisations[this.props.organisationId-1];
    const curriedHandleEditModalShow = () => this.handleEditModalShow(userOrganisation);
    const shiftProps = {
      handleEditShiftModalShow: this.handleEditShiftModalShow,
      HandleDeleteShiftSubmit: this.HandleDeleteShiftSubmit,
      shifts: this.props.shifts,
    }

    return (
      <div>
        <h3>My Organisation: {(this.props.organisations.length < 1) ? '' : userOrganisation.name}</h3>
        {this.props.organisations.length < 1
          ? (
            <p>Loading Organisations...</p>
          )
          : (
            <div>
              <p>Hourly Rate: {currencyFormatted(userOrganisation.hourlyRate)}</p>
              <ButtonToolbar> 
                <Button 
                  bsStyle="primary" 
                  className='leaveButton' 
                  onClick={curriedHandleEditModalShow}
                >
                  Edit Organisation
                </Button>
                <Button 
                  bsStyle="danger" 
                  className='leaveButton' 
                  onClick={this.handleLeaveModalShow}
                >
                  Leave Organisation
                </Button>
              </ButtonToolbar> 
            

              {/* Display shifts section */}
              <h3>Shifts at {userOrganisation.name}</h3>
              <ButtonToolbar> 
                <Button 
                  bsStyle="primary" 
                  className='leaveButton' 
                  onClick={this.handleNewShiftModalShow}
                >
                  Add new shift
                </Button>
              </ButtonToolbar> 
              <ListShifts props={shiftProps}/>
            </div>
          )}
      </div>
    )
  }

  renderMainPage() {
    return (
      <div>
        <div className="Main">
          <h1>Welcome {this.props.name}</h1>
          <p className="small">Your email is {this.props.email}</p>
          <hr />
        </div>
        <div className="organisations">
          {this.props.organisationId ? this.renderUsersOrganisations() : this.renderNoUserOrganisations()}
        </div>
      </div>
    );
  }

  render() {
    const modalProps ={
      homeState: this.state,
      appProps: this.props,
      validateOrgModalForm: this.validateOrgModalForm,
      validateNewShiftModalForm: this.validateNewShiftModalForm,
      handleModalClose: this.handleModalClose,
      handleChange: this.handleChange,
      handleBreakTimeChange: this.handleBreakTimeChange,
      handleStartDataChange: this.handleStartDataChange,
      handleFinishDataChange: this.handleFinishDataChange,
      handleOrgUpdateModalSubmit: this.handleOrgUpdateModalSubmit,
      handleOrgCreateJoinModalSubmit: this.handleOrgCreateJoinModalSubmit,
      handleLeaveModalSubmit: this.handleLeaveModalSubmit,
      handleAddNewShiftModalSubmit: this.handleAddNewShiftModalSubmit,
      handleDropdownOptionChange: this.handleDropdownOptionChange,
    }

    return (
      <div className="Home">
        {this.props.isAuthenticated === false
          ? this.renderWelcomePage()
          : this.renderMainPage()}
        <RenderEditOrgModal childProps={modalProps}/>
        <RenderCreateJoinOrgModal childProps={modalProps}/>
        <RenderLeaveOrgModal childProps={modalProps}/>
        <RenderNewShiftModal childProps={modalProps}/>
      </div>
    );
  }
}