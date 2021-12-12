export function getCurrentDate(separator='/'){

    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    
    return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
}



export function sortByPublished(a,b){
    if(a.releaseCond == b.releaseCond){return sortByDate(a,b);} return a.releaseCond > b.releaseCond ? -1 : 1;
}

export function sortByDifficulties(a,b,difficulty){
    switch(difficulty){
        case 'easy':
            if(a.difficulties.easy == b.difficulties.easy){return sortByDate(a,b);} return a.difficulties.easy > b.difficulties.easy ? 1 : -1;
            break;
        case 'normal':
            if(a.difficulties.normal == b.difficulties.normal){return sortByDate(a,b);} return a.difficulties.normal > b.difficulties.normal ? 1 : -1;
            break;
        case 'hard':
            if(a.difficulties.hard == b.difficulties.hard){return sortByDate(a,b);} return a.difficulties.hard > b.difficulties.hard ? 1 : -1;
            break;
        case 'expert':
            if(a.difficulties.expert == b.difficulties.expert){return sortByDate(a,b);} return a.difficulties.expert > b.difficulties.expert ? 1 : -1;
            break;
        case 'master':
            if(a.difficulties.master == b.difficulties.master){return sortByDate(a,b);} return a.difficulties.master > b.difficulties.master ? 1 : -1;
            break;
    }

    

}

export function sortByDate(a,b){
    if(a.publish_date == b.publish_date){return 0;} return a.publish_date > b.publish_date ? 1 : -1;
}


