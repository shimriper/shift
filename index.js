const env = require('./env');
const express = require('express'); // Fast, unopinionated, minimalist web framework for node.
const app = express(); // Initiate Express Application
const router = express.Router(); // Creates a new router object.
const mongoose = require('mongoose'); // Node Tool for MongoDB
const config = require('./config/database'); // Mongoose Config
const path = require('path'); // NodeJS Package for file paths
const bodyParser = require('body-parser'); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
const port = process.env.PORT || 3000; // Allows heroku to set port
const cors = require('cors'); // CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
const cookieParser = require('cookie-parser');


const userRoutes = require("./routes/user.routes");
const sidurRoutes = require("./routes/sidur.routes");
const weeksRoutes = require("./routes/weeks.routes");
const shiftsRoutes = require("./routes/shifts.routes");
const passwordResetTokenRoutes = require("./routes/passwordResetToken");




// Database Connection
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.log('Could NOT connect to database: ', err);
    } else {
        console.log('Connected to database: ' + config.db);
    }
});

// Middleware
app.use(cors({
    origin: 'http://localhost:4200'
}));


// Middleware
app.use(bodyParser.urlencoded({
    extended: false
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(express.static(__dirname + '/public')); // Provide static directory for frontend
app.use('/user', userRoutes);
app.use('/shifts', shiftsRoutes);
app.use('/weeks', weeksRoutes);
app.use('/sidur', sidurRoutes);
app.use('/resetpassword', passwordResetTokenRoutes);




// Connect server to Angular 2 Index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// Start Server: Listen on port 8080
app.listen(port, () => {
    console.log('Listening on port:' + " " + port);
});