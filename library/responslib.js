module.exports = function responsdata (data , is_error , message){

    if(is_error === undefined){
        JSON.is_error = false;
    }

    if(message === undefined){
         JSON.message = "";
    }


    var getdata = {
        "data":data,
        "error":is_error,
        "message":message
    };
    return getdata;
}
