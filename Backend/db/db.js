const mongoose = require('mongoose');

function connectToDb() {
    mongoose.connect(process.env.DB_CONNECT, {
        serverSelectionTimeoutMS: 5000,  // fail fast — 5s instead of hanging forever
        connectTimeoutMS: 5000,
    }).then(() => {
        console.log('Connected to DB');
    }).catch(err => {
        console.log('❌ MongoDB connection failed:', err.message);
    });
}

module.exports = connectToDb;