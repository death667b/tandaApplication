import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import currencyFormatted from '../util/currencyFormatted.js';

const ListShifts = parentProps => {
  const { shifts } = parentProps;

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
        dataFormat={ currencyFormatted }
      >Shift Cost</TableHeaderColumn>
    </BootstrapTable>
  )
} 

export default ListShifts;