import React, { PureComponent } from 'react';
import { Button, MenuItem, DropdownButton, Modal, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import DateTimePicker from 'react-datetime-picker';
import "./Modal.css";

export class RenderEditOrgModal extends PureComponent {
  render() {
    const {
      homeState,
      handleModalClose,
      handleChange,
      validateOrgModalForm,
      handleOrgUpdateModalSubmit
    } = this.props.childProps;

    return (
      
      <Modal 
        show={homeState.showEditModal} 
        onHide={handleModalClose} 
        aria-labelledby="EditOrgModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Editing Details for {homeState.orgName}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form>
            <FormGroup controlId="newName" bsSize="large">
              <ControlLabel>New Organisation Name</ControlLabel>
              <FormControl
                autoFocus
                type="name"
                value={homeState.newName}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup controlId="newHourlyRate" bsSize="large">
              <ControlLabel>New Hourly Rate</ControlLabel>
              <FormControl
                autoFocus
                type="tel"
                value={homeState.newHourlyRate}
                onChange={handleChange}
              />
            </FormGroup>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle="danger" onClick={handleModalClose}>
            Cancel
          </Button>
            <Button
              bsStyle="success"
              disabled={!validateOrgModalForm()}
              type="submit"
              onClick={handleOrgUpdateModalSubmit}
            >
              Update
            </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export class RenderCreateJoinOrgModal extends PureComponent {
  render() {
    const {
      homeState,
      handleModalClose,
      handleChange,
      validateOrgModalForm,
      handleOrgCreateJoinModalSubmit
    } = this.props.childProps;

    return (
      <Modal 
        show={homeState.showCreateJoinModal} 
        onHide={handleModalClose} 
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
                value={homeState.newName}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup controlId="newHourlyRate" bsSize="large">
              <ControlLabel>New Hourly Rate</ControlLabel>
              <FormControl
                autoFocus
                type="tel"
                value={homeState.newHourlyRate}
                onChange={handleChange}
              />
            </FormGroup>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle="danger" onClick={handleModalClose}>
            Cancel
          </Button>
            <Button
              bsStyle="success"
              disabled={!validateOrgModalForm()}
              type="submit"
              onClick={handleOrgCreateJoinModalSubmit}
            >
              Create and Join
            </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export class RenderLeaveOrgModal extends PureComponent {
  render() {
    const {
      homeState,
      handleModalClose,
      handleLeaveModalSubmit
    } = this.props.childProps;

    return (
      <Modal 
        show={homeState.showLeaveModal} 
        onHide={handleModalClose} 
        aria-labelledby="LeaveOrgModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Leave organisation?</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure you want to leave your current organisation?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle="success" onClick={handleModalClose}>
            Cancel
          </Button>
            <Button
              bsStyle="danger"
              type="submit"
              onClick={handleLeaveModalSubmit}
            >
              Leave
            </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export class RenderEditUserModal extends PureComponent {
  render() {
    const {
      show,
      name,
      newName,
      email,
      newEmail,
      oldPassword,
      newPassword,
      newConfirmPassword,
      handleChange,
      handleModalClose,
      handleModalRenameSubmit,
      handleModalPasswordSubmit,
      validateModalRenameForm,
      validateModelPasswordForm,
    } = this.props.props;  



    return (
      <Modal show={show} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editing Details for {name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleModalRenameSubmit}>
            <FormGroup controlId="newName" bsSize="large">
              <ControlLabel>Name</ControlLabel>
              <FormControl
                autoFocus
                type="name"
                value={newName || name}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup controlId="newEmail" bsSize="large">
              <ControlLabel>Email</ControlLabel>
              <FormControl
                autoFocus
                type="email"
                value={newEmail || email}
                onChange={handleChange}
              />
            </FormGroup>
            <Button
              block
              bsStyle="success"
              bsSize="large"
              disabled={!validateModalRenameForm()}
              type="submit"
            >
              Save new details
            </Button>
          </form>
          <form onSubmit={handleModalPasswordSubmit}>
            <FormGroup controlId="oldPassword" bsSize="large">
              <ControlLabel>Old Password</ControlLabel>
              <FormControl
                value={oldPassword}
                onChange={handleChange}
                type="password"
              />
            </FormGroup>
            <FormGroup controlId="newPassword" bsSize="large">
              <ControlLabel>New Password</ControlLabel>
              <FormControl
                value={newPassword}
                onChange={handleChange}
                type="password"
              />
            </FormGroup>
            <FormGroup controlId="newConfirmPassword" bsSize="large">
              <ControlLabel>Confirm New Password</ControlLabel>
              <FormControl
                value={newConfirmPassword}
                onChange={handleChange}
                type="password"
              />
            </FormGroup>
            <Button
              block
              bsStyle="success"
              bsSize="large"
              disabled={!validateModelPasswordForm()}
              type="submit"
            >
              Save new password
            </Button>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle="danger" onClick={handleModalClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export class RenderNewShiftModal extends PureComponent {
  render() {
    const {
      homeState,
      appProps,
      handleModalClose,
      handleBreakTimeChange,
      handleStartDataChange,
      handleFinishDataChange,
      handleAddNewShiftModalSubmit,
      validateNewShiftModalForm,
      handleDropdownOptionChange
    } = this.props.childProps;

    const { allUsers } = appProps;

    const userOrganisation = appProps.organisations[appProps.organisationId-1] || {};
    const orgUsers = allUsers.filter(user => user.organisationId === userOrganisation.id);

    const curriedhandleDropdownOptionChange = (eventKey, event)  => {
      handleDropdownOptionChange(orgUsers[eventKey]);
    }

    return (
      <Modal 
        show={homeState.showNewShiftModal} 
        onHide={handleModalClose} 
        aria-labelledby="CreateJoinOrgModal"
        dialogClassName="newShiftModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Shift for {userOrganisation.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form>
            
            <FormGroup controlId="selectedEmpployeeName" bsSize="large">
              <ControlLabel className='datepicker'>Employee Name</ControlLabel>
              <DropdownButton         
                id="selectedEmpployeeName"
                onSelect={curriedhandleDropdownOptionChange}
                title={homeState.selectedOption || 'Select'}
              >
                {(orgUsers.length > 0) && orgUsers.map((opt, i) => (
                  <MenuItem key={i} eventKey={i}>
                    {opt.name}
                  </MenuItem>
                ))}
              </DropdownButton>
            </FormGroup>

            <FormGroup controlId="startDateTime" bsSize="large">
              <ControlLabel className='datepicker'>Start Date/Time</ControlLabel>
              <DateTimePicker
                onChange={handleStartDataChange}
                value={homeState.startDate}
              />
            </FormGroup>
            <FormGroup controlId="finishDateTime" bsSize="large">
              <ControlLabel className='datepicker'>Finish Date/Time</ControlLabel>
              <DateTimePicker
                onChange={handleFinishDataChange}
                value={homeState.finishDate}
                minDate={homeState.startDate}
              />
            </FormGroup>
              
            <FormGroup controlId="breakTime" bsSize="large">
            <ControlLabel>Break time (in minutes)</ControlLabel>
              <FormControl
                type="number"
                value={homeState.breakTime}
                onChange={handleBreakTimeChange}
              />
            </FormGroup>
            <FormGroup controlId="hoursWorked" bsSize="large">
              <ControlLabel>Hours Worked</ControlLabel>
              <FormControl
                type="text"
                disabled
                value={homeState.hoursWorked}
              />
            </FormGroup>
            <FormGroup controlId="shiftCost" bsSize="large">
              <ControlLabel>Shift Cost</ControlLabel>
              <FormControl
                type="text"
                disabled
                value={homeState.shiftCost}
              />
            </FormGroup>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle="danger" onClick={handleModalClose}>
            Cancel
          </Button>
            <Button
              bsStyle="success"
              disabled={!validateNewShiftModalForm()}
              type="submit"
              onClick={handleAddNewShiftModalSubmit}
            >
              Add new shift
            </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

export class RenderEditShiftModal extends PureComponent {
  render() {
    const {
      homeState,
      appProps,
      handleModalClose,
      handleBreakTimeChange,
      handleStartDataChange,
      handleFinishDataChange,
      handleEditShiftModalSubmit,
      validateNewShiftModalForm,
      handleDropdownOptionChange
    } = this.props.childProps;

    const { allUsers } = appProps;

    const userOrganisation = appProps.organisations[appProps.organisationId-1] || {};
    const orgUsers = allUsers.filter(user => user.organisationId === userOrganisation.id);

    const curriedhandleDropdownOptionChange = (eventKey, event)  => {
      handleDropdownOptionChange(orgUsers[eventKey]);
    }

    return (
      <Modal 
        show={homeState.showEditShiftModal} 
        onHide={handleModalClose} 
        aria-labelledby="CreateJoinOrgModal"
        dialogClassName="newShiftModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Shift for {userOrganisation.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form>
            
            <FormGroup controlId="selectedEmpployeeName" bsSize="large">
              <ControlLabel className='datepicker'>Employee Name</ControlLabel>
              <DropdownButton         
                id="selectedEmpployeeName"
                onSelect={curriedhandleDropdownOptionChange}
                title={homeState.selectedOption || 'Select'}
              >
                {(orgUsers.length > 0) && orgUsers.map((opt, i) => (
                  <MenuItem key={i} eventKey={i}>
                    {opt.name}
                  </MenuItem>
                ))}
              </DropdownButton>
            </FormGroup>

            <FormGroup controlId="startDateTime" bsSize="large">
              <ControlLabel className='datepicker'>Start Date/Time</ControlLabel>
              <DateTimePicker
                onChange={handleStartDataChange}
                value={homeState.startDate}
              />
            </FormGroup>
            <FormGroup controlId="finishDateTime" bsSize="large">
              <ControlLabel className='datepicker'>Finish Date/Time</ControlLabel>
              <DateTimePicker
                onChange={handleFinishDataChange}
                value={homeState.finishDate}
                minDate={homeState.startDate}
              />
            </FormGroup>
              
            <FormGroup controlId="breakTime" bsSize="large">
            <ControlLabel>Break time (in minutes)</ControlLabel>
              <FormControl
                type="number"
                value={homeState.breakTime}
                onChange={handleBreakTimeChange}
              />
            </FormGroup>
            <FormGroup controlId="hoursWorked" bsSize="large">
              <ControlLabel>Hours Worked</ControlLabel>
              <FormControl
                type="text"
                disabled
                value={homeState.hoursWorked}
              />
            </FormGroup>
            <FormGroup controlId="shiftCost" bsSize="large">
              <ControlLabel>Shift Cost</ControlLabel>
              <FormControl
                type="text"
                disabled
                value={homeState.shiftCost}
              />
            </FormGroup>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle="danger" onClick={handleModalClose}>
            Cancel
          </Button>
            <Button
              bsStyle="warning"
              disabled={!validateNewShiftModalForm()}
              type="submit"
              onClick={handleEditShiftModalSubmit}
            >
              Update shift
            </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}