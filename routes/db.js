/*eslint-env node */
try {
    var cloudant = require('cloudant')({
      url: cloudantService.credentials.url,
      plugin: 'retry',
      retryAttempts: 10,
      retryTimeout: 500
    });
    exports.cloudant = cloudant;
    var descDb = cloudant.use('desc');
    exports.descDb = descDb;
}
catch (e) {
    console.error("Error initializing services for /db: ", e);
}

//populate the db with these desc keys.
var populateDB = function() {

    var desc = require('./starter_docs/registrardesc.json');

    for (var p in desc){
        descDb.insert(desc[p], function(err/*, body, header*/) {
            if (err){
                //console.log('error in populating the DB desc: ' + err );
            }
        });
    }
};
exports.populateDB = populateDB;

//Initiate the database.
var initDB = function() {

    // Bound service check
    if (typeof cloudant == 'undefined')
        return res.send({msg:'Error: Cannot run initDB() w/o Cloudant service'});

    cloudant.db.create('desc', function(err/*, body*/) {
	    if (!err) {
	        populateDB();
	        //console.log('Successfully created database and populated!');
	    } else {
	        //console.log("Concierge User already exists.");
	    }
    });
};
exports.initDB = initDB;
