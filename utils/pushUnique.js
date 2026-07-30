module.exports.pushUnique = function (listings, list){
    if(listings){
        for(let listing of listings){
            if(!has(list, listing)){
                list.push(listing);
            }
        }
    }
    return list;
}

function has(parent, search){
    for(let p of parent){
        if(p.title == search.title && p.description == search.description){
            return true;
        }
    }
    return false;
}
