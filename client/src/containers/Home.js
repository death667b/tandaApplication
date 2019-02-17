import React, { Component } from "react";
import { Button, ButtonToolbar } from 'react-bootstrap'
import axios from 'axios';

import { 
  RenderEditOrgModal, 
  RenderCreateJoinOrgModal, 
  RenderLeaveOrgModal } from '../components/Modal.js';
import ListOrganisations from '../components/ListOrganisations.js';
import ListShifts from '../components/ListShifts.js';
import currencyFormatted from '../util/currencyFormatted.js';
import cleanHourlyRate from '../util/cleanHourlyRate.js';

import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showEditModal: false,
      showCreateJoinModal: false,
      showLeaveModal: false,
      newName: '',
      newHourlyRate: '',
      orgId: '',
      orgName: ''
    };
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
              <ListShifts shifts={this.props.shifts}/>
            </div>
          )}
      </div>
    )
  }

  validateOrgModalForm = () => {
    return (
      this.state.newName.length > 0 &&
      cleanHourlyRate(this.state.newHourlyRate)
    );
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
      console.log(e)
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
      validateOrgModalForm: this.validateOrgModalForm,
      handleModalClose: this.handleModalClose,
      handleChange: this.handleChange,
      handleOrgUpdateModalSubmit: this.handleOrgUpdateModalSubmit,
      handleOrgCreateJoinModalSubmit: this.handleOrgCreateJoinModalSubmit,
      handleLeaveModalSubmit: this.handleLeaveModalSubmit
    }

    return (
      <div className="Home">
        {this.props.isAuthenticated === false
          ? this.renderWelcomePage()
          : this.renderMainPage()}
        <RenderEditOrgModal childProps={modalProps}/>
        <RenderCreateJoinOrgModal childProps={modalProps}/>
        <RenderLeaveOrgModal childProps={modalProps}/>
      </div>
    );
  }
}