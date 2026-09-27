export const groupShiftsByDate = (shifts) => {
  if (!shifts) return [];
  
  const grouped = shifts.reduce((acc, shift) => {
    
    const date = new Date(shift.startTime).toDateString();
    
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(shift);
    return acc;
  }, {});

  return Object.keys(grouped).map(date => ({
    title: date,
    data: grouped[date]
  }));
};