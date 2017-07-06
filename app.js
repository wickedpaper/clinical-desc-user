var express = require('express');
var bodyParser = require('body-parser');
var cfenv = require("cfenv");
var path = require('path');
var cors = require('cors');

// Setup the required environment variables
var vcapLocal = null;
try {
  vcapLocal = require("./vcap-local.json");
}
catch (e) {}

var appEnvOpts = vcapLocal ? {vcap:vcapLocal} : {};
var appEnv = cfenv.getAppEnv(appEnvOpts);

try {
	cloudantService = appEnv.services.cloudantNoSQLDB[0];
}
catch (e) {
	console.error("Error looking up service: ", e);
}

// Setup route handlers
var desc = require('./routes/desc');

// Setup express middleware.
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'www')));

// REST HTTP Methods
app.get('/db/:option', desc.dbOptions);
app.get('/policies', desc.list);
app.get('/fib', desc.fib);
app.get('/loadTest', desc.loadTest);
app.get('/policies/:id', desc.find);
app.post('/policies', desc.create);
app.put('/policies/:id', desc.update);
app.delete('/policies/:id', desc.remove);

// start server on the specified port and binding host
app.listen(appEnv.port, "0.0.0.0", function () {
  // print a message when the server starts listening
  console.log("desc server starting on " + appEnv.url);
});
