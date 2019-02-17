const sortShifts = shifts => {
  const rearrangeDate = date => {
    const splitDate = date.split('/');
    const newDate = splitDate[1] + '/' + splitDate[0] + '/' + splitDate[2];
    return newDate;
  }

  const shiftsCopy = JSON.parse(JSON.stringify(shifts));
  shiftsCopy.sort( (a,b) => {
    a = new Date(rearrangeDate(a.shiftDate));
    b = new Date(rearrangeDate(b.shiftDate));
    return a>b ? -1 : a<b ? 1 : 0; 
  })

  return shiftsCopy;
}

export default sortShifts;