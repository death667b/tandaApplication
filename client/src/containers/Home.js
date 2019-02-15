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

  // componentDidMount() {

  //   // if(this.props.sessionId || this.props.isAuthenticated) {
  //   //   console.log('being run')
  //   //   const headers = {
  //   //     'Content-Type': 'application/json',
  //   //     'Authorization': this.props.sessionId
  //   //   }

  //   //   try {
  //   //     axios.get(`http://localhost:3000/organisations`, {headers})
  //   //       .then(res => {
  //   //         this.setState({ 
  //   //           organisations: res.data
  //   //         });
  //   //       })
  //   //   } catch (e) {
  //   //     alert(e.response.data.error);
  //   //   }
  //   // }

  // }

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

    return (
      <div>
        <h3>My Organisation</h3>
        {this.props.organisations.length < 1
          ? (
            <p>Loading Organisations...</p>
          )
          : (
            <div>
              <p>Name: {userOrganisation.name}</p>
              <p>
                Hourly Rate: {this.currencyFormatted(userOrganisation.hourlyRate)}<br />
                <Button 
                  bsStyle="danger" 
                  className='leaveButton' 
                  onClick={this.handleLeaveModalShow}
                >
                  Leave Organisation
                </Button>
              </p>
            </div>
          )}


        <h3>Shifts</h3>
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

  HandleJoinSubmit = orgId => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': this.props.sessionId
    }

    const data = {
        "organisationId": orgId
      }

    try {
      axios.post(`http://localhost:3000/organisations/join`, data, {headers})
        .then(res => {
          this.props.userHasChangedOrganisation(orgId);
        })
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
    this.setState({ 
      showEditModal: true,
      orgId: row.id,
      orgName: row.name,
      newName: row.name,
      newHourlyRate: row.hourlyRate
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
          alert('Organisation successfully updated!');

          const oldOrg = JSON.parse(JSON.stringify(this.props.organisations))
          oldOrg[orgId-1] = {id: orgId, ...updateOrganisation};

          this.setState({
            showEditModal: false,
            newName: '',
            newHourlyRate: '',
          });

          this.props.upateOrganisations(oldOrg);
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
      await axios.post(`http://localhost:3000/organisations/create_join`, createOrganisation, {headers})
        .then(res => {
          alert('Organisation successfully Created and Joined!');

          const oldOrg = JSON.parse(JSON.stringify(this.props.organisations))
          oldOrg.push(res.data)

          this.setState({
            showCreateJoinModal: false,
            newName: '',
            newHourlyRate: '',
          });

          this.props.updateOrganisationAndUserId(res.data.id, oldOrg)

          // this.props.upateOrganisations(oldOrg);
          // this.props.userHasChangedOrganisation(res.data.id);
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
          alert('You have successfully left your Organisation!');

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
          <p className="small">Your user number {this.props.userId} and your email address is {this.props.email}</p>
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