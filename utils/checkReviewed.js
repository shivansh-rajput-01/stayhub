module.exports.checkReviewed = function(obj, userId){
    for(let o of obj){
        console.log(o);
        if(o.author._id.equals(userId)){
            return true;
        }
    }
    return false;
} 