import React, { Component } from "react";
import { Button, ButtonToolbar, Modal, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import axios from 'axios';

import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      organisations: [],
      showEditModal: false,
      newName: '',
      newHourlyRate: '',
      orgId: '',
      orgName: ''
    };
  }

  componentWillMount() {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': this.props.sessionId
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
        <p>You are currently not apart of any Organisations.<br />Please join or create one.</p>
        {this.renderListOrganisations()}
      </div>

    )
  }

  renderUsersOrganisations() {
    return (
      <p>Details of your Organisation</p>
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
    const curriedHandleEditModalShow = () => {
      this.handleEditModalShow(row);
    }
    return (
    <ButtonToolbar className='orgButtonToolbar'>        
      <Button className='orgButton' onClick={curriedHandleEditModalShow}>Edit</Button>
      <Button className='orgButton'>Join</Button>
    </ButtonToolbar>
    );
  }

  handleEditModalClose = () => {
    this.setState({ 
      showEditModal: false,
      newName: '',
      newHourlyRate: '',
    });
  }

  handleEditModalShow = (row) => {
    this.setState({ 
      showEditModal: true,
      orgId: row.id,
      orgName: row.name,
      newName: row.name,
      newHourlyRate: row.hourlyRate
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

  validateOrgUpdateModalForm() {
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

          const oldOrg = JSON.parse(JSON.stringify(this.state.organisations))
          oldOrg[orgId-1] = {id: orgId, ...updateOrganisation};

          this.setState({ 
            organisations: oldOrg,
            showEditModal: false,
            newName: '',
            newHourlyRate: '',
          });
        })
    } catch (e) {
      alert(e.response.data.error);
    }
  }


  renderEditOrgModal = () => {
    return (
      <Modal show={this.state.showEditModal} onHide={this.handleEditModalClose} >
        <Modal.Header closeButton>
          <Modal.Title>Editing Details for {this.state.orgName}</Modal.Title>
        </Modal.Header>
      {/* orgId: row.id, */}

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
          <Button variant="secondary" onClick={this.handleEditModalClose}>
            Cancel
          </Button>
            <Button
              disabled={!this.validateOrgUpdateModalForm()}
              type="submit"
              onClick={this.handleOrgUpdateModalSubmit}
            >
              Update
            </Button>
        </Modal.Footer>
      </Modal>
    )
  }

  renderListOrganisations() {
    const organisations = this.state.organisations;

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
          <h3>Organisations</h3>
            {this.props.organisationId ? this.renderNoUserOrganisations() : this.renderUsersOrganisations()}
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
      </div>
    );
  }
}