const formatShiftRows = async (rawShiftData, userData, userOrg) => {
  const formattedData = [];
  const hourlyRate = userOrg.hourlyRate;

  rawShiftData.forEach(shift => {
    const name = userData.filter(user => user.id === shift.userId)[0].name;
    const startDateObj = new Date(shift.start);
    const finsihDateObj = new Date(shift.finish);
    const shiftDate = startDateObj.getDate() + '/' + (startDateObj.getMonth()+1) + '/' + startDateObj.getFullYear();
    const startTime = startDateObj.getHours() + ':' + startDateObj.getMinutes();
    const finishTime = finsihDateObj.getHours() + ':' + finsihDateObj.getMinutes();
    const breakLength = shift.breakLength;
    const hoursWorkedMinutes = (finsihDateObj-startDateObj)/1000/60;
    const hoursWorked = (hoursWorkedMinutes-breakLength >= 0) ?
      ((hoursWorkedMinutes-breakLength)/60).toFixed(2) :
      0;
    const shiftCost = hourlyRate * hoursWorked;

    const newShift = {
      id: shift.id,
      name,
      shiftDate,
      startTime,
      finishTime,
      breakLength,
      hoursWorked,
      shiftCost
    }
    formattedData.push(newShift);
  })
  return formattedData;
}

export default formatShiftRows;