const cleanHourlyRate = rate => {
  const newHourlyRate = parseFloat(rate);
  return (newHourlyRate > 0) ? newHourlyRate : false;
}

export default cleanHourlyRate;