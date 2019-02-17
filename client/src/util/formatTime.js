const formatTime = time => {
  const fDate = time.getFullYear() + '-' + (time.getMonth()+1) + '-' + time.getDate();
  const fTime = time.getHours() + ':' + time.getMinutes();

  return fDate + ' ' + fTime;
}

export default formatTime;