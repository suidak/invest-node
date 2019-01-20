var mongoose = require('mongoose');
var url = "mongodb://localhost:27017/inspiniad";
mongoose.connect(url, function(err, result){
    if(err)
        return console.log("Could not connect");
    else
    return console.log("connected");
});

module.exports = mongoose;