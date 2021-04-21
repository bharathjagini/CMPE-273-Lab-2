const { mongoDB } = require('./config');
const mongoose = require('mongoose');
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 500,
    bufferMaxEntries: 0,
    useFindAndModify:false,
     autoIndex: false 
  
};
mongoose.connect(mongoDB, options, (err, res) => {
    if (err) {
        console.log(err);
        console.log(`MongoDB Connection Failed`);
    } else {
        console.log(`MongoDB Connected`);
    }
});
mongoose.set("useFindAndModify",false);
mongoose.set('debug', true);