module.exports.starRatingArray = function(stars){
    stars = Number(stars);
    let arr = [];
    for(let i=0; i<Math.floor(stars); i++){
        arr.push(`100%`);
    }
    if(stars - Math.floor(stars)){
        arr.push(`${(Math.floor((stars - Math.floor(stars))* 100))}%`);
    }
    let l = arr.length;
    for(let i=l; i<5; i++){
        arr.push(`0%`);
    }
    return arr;
}