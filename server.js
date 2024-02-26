const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/user-auth')
    .then(() => console.log('Connected!'));

module.exports = mongoose
