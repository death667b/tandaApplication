import React, { PureComponent } from 'react';
import { Button, Modal, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

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