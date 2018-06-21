var express = require('express');
var mongoose = require('mongoose');
const path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
const passport = require('passport');
const config = require('./config/database');
const usersRoute = require('./routes/usersRoute');
const appointmentRoute = require('./routes/appointmentRoute');
const prescriptionRoute = require('./routes/prescriptionRoute');
const patientsRoute = require('./routes/patientsRoute');
const adminsRoute = require('./routes/adminsRoute');
const doctorsRoute = require('./routes/doctorsRoute');

//Initialize express
var app = express(); 

//Connect to database   
mongoose.connect('mongodb://localhost:27017/healthmanagement');

//On connection 
mongoose.connection.on('connected', () => {
	console.log('Connected to the mongodb database @ 27017' + config.database);
}); 

//On error
mongoose.connection.on('error', (err) => {
	if (err) {
		console.log('Error connecting to database:' + err); 
	}
});


//Index route
app.get('/', (req, res) => {
	res.send('Invalid text');
})

//CORS middleware
app.use(cors());

//static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

//Passport middleware
/* app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport); */


app.use('/appointment', appointmentRoute);
app.use('/prescription', prescriptionRoute);
app.use('/users', usersRoute);
app.use('/patients', patientsRoute);
app.use('/admin', adminsRoute);
app.use('/doctor', doctorsRoute);

//Server port
const PORT = 4003;

//To start server
app.listen(PORT, () =>{
	console.log(" node server started at port number 4003");
})