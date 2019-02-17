const calcHoursWorked = (start, finish, breakTime, hourlyRate) => {
  const minWork = Math.round(((finish - start)/1000/60)-breakTime);
  const hoursWorked = (minWork/60).toFixed(2);
  const shiftCost = hoursWorked * hourlyRate;
  return { hoursWorked, shiftCost };
} 

export default calcHoursWorked;