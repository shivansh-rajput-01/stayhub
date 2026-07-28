module.exports.averageRating = function(reviews){
    if(!reviews || reviews.length == 0){
        return false;
    }
    let sum = 0;
    for(let review of reviews){
        sum += Number(review.rating)
    }
    return sum / reviews.length;
}