import React from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import currencyFormatted from '../util/currencyFormatted.js';

const ListOrganisations = parentProps => {
  const { 
    organisations, 
    handleEditModalShow, 
    HandleJoinSubmit 
  } = parentProps.props;

  const buttonFormatter = (cell, row) => {
    const curriedHandleEditModalShow = () => handleEditModalShow(row);
    const curriedHandleJoinSubmit = () => HandleJoinSubmit(row.id);

    return (
    <ButtonToolbar className='orgButtonToolbar'>        
      <Button className='orgButton' onClick={curriedHandleEditModalShow}>Edit</Button>
      <Button className='orgButton' onClick={curriedHandleJoinSubmit}>Join</Button>
    </ButtonToolbar>
    );
  }

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
        dataFormat={ currencyFormatted }
      >Hourly Rate</TableHeaderColumn>
      <TableHeaderColumn 
        dataField='id' 
        width='220'
        dataFormat={buttonFormatter}
      ></TableHeaderColumn>
    </BootstrapTable>
  )
}

export default ListOrganisations;