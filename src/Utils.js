export function getCurrentDate(separator='/'){

    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    
    return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
}

export function sortByLevel(a,b){
    if(a.difficulties.master == b.difficulties.master){return sortByDate(a,b);} return a.difficulties.master > b.difficulties.master ? 1 : -1;
}

export function sortByDate(a,b){
    if(a.publish_date == b.publish_date){return 0;} return a.publish_date > b.publish_date ? 1 : -1;
}


