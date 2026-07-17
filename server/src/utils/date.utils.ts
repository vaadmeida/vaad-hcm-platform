
type WorkingDaysType = {
    startDate: Date;
    endDate: Date;
}


export function calculateWorkingDays({startDate, endDate}: WorkingDaysType ){
     let count = 0;

     const current = new Date(startDate)
     const end = new Date(endDate)

     while(current <= end){
          const day = current.getDay()
          if (day !== 0 && day !== 6) count ++
          current.setDate(current.getDate() + 1);
     }
     return count
}