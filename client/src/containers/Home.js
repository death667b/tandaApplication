import React, { Component } from "react";
import { Button, ButtonToolbar, Modal, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import axios from 'axios';

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
        {this.renderListOrganisations()}
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
              <p>Hourly Rate: {this.currencyFormatted(userOrganisation.hourlyRate)}</p>
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
              {this.renderListShifts()}
            </div>
          )}
      </div>
    )
  }

  renderOrganisationItem = props => {
    return (
      <div></div>
    )
  }

  currencyFormatted = (amount) => {
    let i = parseFloat(amount);
    if(isNaN(i)) i = 0.00; 
    let minus = '';
    if(i < 0) minus = '-';
    i = Math.abs(i);
    i = parseInt((i + .005) * 100);
    i = i / 100;
    let s = i.toString();
    if(s.indexOf('.') < 0) { s += '.00'; }
    if(s.indexOf('.') === (s.length - 2)) { s += '0'; }
    s = '$' + minus + s;
    return s;
  }

  buttonFormatter = (cell, row) => {
    const curriedHandleEditModalShow = () => this.handleEditModalShow(row);
    const curriedHandleJoinSubmit = () => this.HandleJoinSubmit(row.id);

    return (
    <ButtonToolbar className='orgButtonToolbar'>        
      <Button className='orgButton' onClick={curriedHandleEditModalShow}>Edit</Button>
      <Button className='orgButton' onClick={curriedHandleJoinSubmit}>Join</Button>
    </ButtonToolbar>
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

  cleanHourlyRate = rate => {
    const newHourlyRate = parseFloat(rate);
    return (newHourlyRate > 0) ? newHourlyRate : false;
  }

  validateOrgModalForm() {
    return (
      this.state.newName.length > 0 &&
      this.cleanHourlyRate(this.state.newHourlyRate)
    );
  }

  handleOrgUpdateModalSubmit = async event => {
    event.preventDefault();

    const cleanedHourlyRate = this.cleanHourlyRate(this.state.newHourlyRate);
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

    const cleanedHourlyRate = this.cleanHourlyRate(this.state.newHourlyRate);

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

  renderEditOrgModal = () => {
    return (
      <Modal 
        show={this.state.showEditModal} 
        onHide={this.handleModalClose} 
        aria-labelledby="EditOrgModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Editing Details for {this.state.orgName}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form>
            <FormGroup controlId="newName" bsSize="large">
              <ControlLabel>New Organisation Name</ControlLabel>
              <FormControl
                autoFocus
                type="name"
                value={this.state.newName}
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup controlId="newHourlyRate" bsSize="large">
              <ControlLabel>New Hourly Rate</ControlLabel>
              <FormControl
                autoFocus
                type="tel"
                value={this.state.newHourlyRate}
                onChange={this.handleChange}
              />
            </FormGroup>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle="danger" onClick={this.handleModalClose}>
            Cancel
          </Button>
            <Button
              bsStyle="success"
              disabled={!this.validateOrgModalForm()}
              type="submit"
              onClick={this.handleOrgUpdateModalSubmit}
            >
              Update
            </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  renderCreateJoinOrgModal = () => {
    return (
      <Modal 
        show={this.state.showCreateJoinModal} 
        onHide={this.handleModalClose} 
        aria-labelledby="CreateJoinOrgModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create and join a new organisation</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form>
            <FormGroup controlId="newName" bsSize="large">
              <ControlLabel>New Organisation Name</ControlLabel>
              <FormControl
                autoFocus
                type="name"
                value={this.state.newName}
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup controlId="newHourlyRate" bsSize="large">
              <ControlLabel>New Hourly Rate</ControlLabel>
              <FormControl
                autoFocus
                type="tel"
                value={this.state.newHourlyRate}
                onChange={this.handleChange}
              />
            </FormGroup>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle="danger" onClick={this.handleModalClose}>
            Cancel
          </Button>
            <Button
              bsStyle="success"
              disabled={!this.validateOrgModalForm()}
              type="submit"
              onClick={this.handleOrgCreateJoinModalSubmit}
            >
              Create and Join
            </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  renderLeaveOrgModal = () => {
    return (
      <Modal 
        show={this.state.showLeaveModal} 
        onHide={this.handleModalClose} 
        aria-labelledby="LeaveOrgModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Leave organisation?</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure you want to leave your current organisation?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle="success" onClick={this.handleModalClose}>
            Cancel
          </Button>
            <Button
              bsStyle="danger"
              type="submit"
              onClick={this.handleLeaveModalSubmit}
            >
              Leave
            </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  renderListShifts() {
    const shifts = this.props.shifts;

    const options = {
      defaultSortName: 'shiftDate',
      defaultSortOrder: 'desc'
    };

    return (
      <BootstrapTable data={ shifts } options={ options } version='4'>
        <TableHeaderColumn 
          dataField='id' 
          isKey 
          width='30' 
          headerAlign='center'
          dataAlign='center'
        >#</TableHeaderColumn>
        <TableHeaderColumn 
          dataField='name'
          width='150' 
          headerAlign='center'
          dataAlign='center'
        >Employee Name</TableHeaderColumn>
        <TableHeaderColumn 
          dataField='shiftDate' 
          headerAlign='center'
          dataAlign='center'
          >Shift Date</TableHeaderColumn>
        <TableHeaderColumn 
          dataField='startTime' 
          headerAlign='center'
          dataAlign='center'
        >Start Time</TableHeaderColumn>
        <TableHeaderColumn 
          dataField='finishTime' 
          headerAlign='center'
          dataAlign='center'
        >Finish Time</TableHeaderColumn>
        <TableHeaderColumn 
          dataField='breakLength' 
          headerAlign='center'
          dataAlign='center'
        >Break Length(in minutes)</TableHeaderColumn>
        <TableHeaderColumn 
          dataField='hoursWorked' 
          headerAlign='center'
          dataAlign='center'
        >Hours Worked</TableHeaderColumn>
        <TableHeaderColumn 
          dataField='shiftCost' 
          headerAlign='center'
          dataAlign='center'
          dataFormat={ this.currencyFormatted }
        >Shift Cost</TableHeaderColumn>
      </BootstrapTable>
    )
  } 

  renderListOrganisations() {
    const organisations = this.props.organisations;

    return (
      <BootstrapTable data={ organisations } version='4'>
        <TableHeaderColumn 
          dataField='id' 
          isKey 
          width='30' 
          headerAlign='center'
          dataAlign='center'
        >#</TableHeaderColumn>
        <TableHeaderColumn dataField='name' headerAlign='center'>Organisation Name</TableHeaderColumn>
        <TableHeaderColumn 
          dataField='hourlyRate' 
          width='150' 
          headerAlign='center'
          dataAlign='center'
          dataFormat={ this.currencyFormatted }
        >Hourly Rate</TableHeaderColumn>
        <TableHeaderColumn 
          dataField='id' 
          width='220'
          dataFormat={this.buttonFormatter}
        ></TableHeaderColumn>
      </BootstrapTable>
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

    return (
      <div className="Home">
        {this.props.isAuthenticated === false
          ? this.renderWelcomePage()
          : this.renderMainPage()}
        {this.renderEditOrgModal()}
        {this.renderCreateJoinOrgModal()}
        {this.renderLeaveOrgModal()}
      </div>
    );
  }
}