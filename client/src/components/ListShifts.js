import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button, ButtonToolbar } from 'react-bootstrap'
import currencyFormatted from '../util/currencyFormatted.js';
import sortShifts from '../util/sortShifts.js';

const ListShifts = parentProps => {
  const { shifts, handleEditShiftModalShow, HandleDeleteShiftSubmit } = parentProps.props;
  const sortedShifts = sortShifts(shifts);

  const buttonFormatter = (cell, row) => {
    const curriedHandleEditShiftModalShow = () => handleEditShiftModalShow(row);
    const curriedHandleDeleteShiftSubmit = () => HandleDeleteShiftSubmit(row.id);

    return (
    <ButtonToolbar className='orgButtonToolbar'>        
      <Button 
        className='orgButton' 
        bsStyle='primary'
        onClick={curriedHandleEditShiftModalShow}
      >Edit</Button>
      <Button 
        className='orgButton' 
        bsStyle='danger' 
        onClick={curriedHandleDeleteShiftSubmit}
      >Delete</Button>
    </ButtonToolbar>
    );
  }

  return (
    <BootstrapTable data={ sortedShifts } version='4'>
      <TableHeaderColumn 
        dataField='id' 
        isKey 
        width='35' 
        headerAlign='center'
        dataAlign='center'
      >#</TableHeaderColumn>
      <TableHeaderColumn 
        dataField='name'
        headerAlign='center'
        dataAlign='center'
      >Employee Name</TableHeaderColumn>
      <TableHeaderColumn 
        dataField='shiftDate' 
        width='110'
        headerAlign='center'
        dataAlign='center'
        >Shift Date</TableHeaderColumn>
      <TableHeaderColumn 
        dataField='startTime' 
        width='110'
        headerAlign='center'
        dataAlign='center'
      >Start Time</TableHeaderColumn>
      <TableHeaderColumn 
        dataField='finishTime' 
        width='110'
        headerAlign='center'
        dataAlign='center'
      >Finish Time</TableHeaderColumn>
      <TableHeaderColumn 
        dataField='breakLength' 
        headerAlign='center'
        dataAlign='center'
        width='140'
      >Break Length</TableHeaderColumn>
      <TableHeaderColumn 
        dataField='hoursWorked' 
        headerAlign='center'
        width='140'
        dataAlign='center'
      >Hours Worked</TableHeaderColumn>
      <TableHeaderColumn 
        dataField='shiftCost' 
        width='110'
        headerAlign='center'
        dataAlign='center'
        dataFormat={ currencyFormatted }
      >Shift Cost</TableHeaderColumn>
      <TableHeaderColumn 
        dataField='id' 
        width='200'
        dataFormat={buttonFormatter}
      ></TableHeaderColumn>
    </BootstrapTable>
  )
} 

export default ListShifts;