'use strict';

var Fabric_Client = require('fabric-client');
var Fabric_CA_Client = require('fabric-ca-client');
var path = require('path');
var util = require('util');
var os = require('os');

exports.admin = function(req, res) {

    let output =[];
    var fabric_client = new Fabric_Client();
    var fabric_ca_client = null;
    var admin_user = null;
    var member_user = null;
    var store_path = path.join(__dirname+"/../../", 'hfc-key-store');
    output.push('Api Required');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true)


// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
    Fabric_Client.newDefaultKeyValueStore({ path: store_path
    }).then((state_store) => {
        // assign the store to the fabric client
        fabric_client.setStateStore(state_store);
    var crypto_suite = Fabric_Client.newCryptoSuite();
    // use the same location for the state store (where the users' certificate are kept)
    // and the crypto store (where the users' keys are kept)
    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
    crypto_suite.setCryptoKeyStore(crypto_store);
    fabric_client.setCryptoSuite(crypto_suite);
    var	tlsOptions = {
        trustedRoots: [],
        verify: false
    };
    // be sure to change the http to https when the CA is running TLS enabled
    fabric_ca_client = new Fabric_CA_Client('http://localhost:7054', tlsOptions , 'ca.example.com', crypto_suite);
    output.push('Api Connected to Ledger');
    // first check to see if the admin is already enrolled
    return fabric_client.getUserContext('admin', true);
}).then((user_from_store) => {
        if (user_from_store && user_from_store.isEnrolled()) {
        //   console.log('Successfully loaded admin from persistence');
        output.push('Successfully loaded admin from persistence');
        admin_user = user_from_store;
        return null;
    } else {
        // need to enroll it with CA server
        return fabric_ca_client.enroll({
            enrollmentID: 'admin',
            enrollmentSecret: 'adminpw'
        }).then((enrollment) => {
            //  console.log('Successfully enrolled admin user "admin"');
            output.push('Successfully enrolled admin user "admin"');
        return fabric_client.createUser(
            {username: 'admin',
                mspid: 'Org1MSP',
                cryptoContent: { privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate }
            });
    }).then((user) => {
            admin_user = user;
        return fabric_client.setUserContext(admin_user);
    }).catch((err) => {
            console.error('Failed to enroll and persist admin. Error: ' + err.stack ? err.stack : err);
        output.push('Failed to enroll and persist admin. Error: ' + err.stack ? err.stack : err);
        throw new Error('Failed to enroll and persist admin. Error: ' + err.stack ? err.stack : err);
    });
    }
}).then(() => {
        // console.log('Assigned the admin user to the fabric client ::' + admin_user.toString());
        //  console.log(admin_user.getSigningIdentity().toString());
        //output.push('Assigned the admin user to the fabric client ::' + admin_user.toString());
        output.push('Assigned the admin user to the fabric client ');
    res.send({code:1,"msg":"Assigned the admin user to the fabric client", 'key':admin_user._identity._certificate, 'log':output});

}).catch((err) => {
        //  console.error('Failed to enroll admin: ' + err);
        output.push('Failed to enroll admin: ' + err);
    res.send({code:1,"msg":"", 'key':'','log':output});
});

};


exports.user = function(req, res) {

    let output=[];
    var username = req.param('username');
    var organization = req.param('organization');
    var fabric_client = new Fabric_Client();
    var fabric_ca_client = null;
    var admin_user = null;
    var member_user = null;
    var store_path = path.join(__dirname+"/../../", 'hfc-key-store');
    // console.log(' Store path:'+store_path);

    if (!username){
        output.push('Username is requred');
        res.send({code:0,"msg":"Username is requred",log:output});
        return;
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true)

// create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
    Fabric_Client.newDefaultKeyValueStore({ path: store_path
    }).then((state_store) => {
        // assign the store to the fabric client
        fabric_client.setStateStore(state_store);
    var crypto_suite = Fabric_Client.newCryptoSuite();
    // use the same location for the state store (where the users' certificate are kept)
    // and the crypto store (where the users' keys are kept)
    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
    crypto_suite.setCryptoKeyStore(crypto_store);
    fabric_client.setCryptoSuite(crypto_suite);
    var	tlsOptions = {
        trustedRoots: [],
        verify: false
    };
    // be sure to change the http to https when the CA is running TLS enabled
    fabric_ca_client = new Fabric_CA_Client('http://localhost:7054', null , '', crypto_suite);
    output.push('Api Connected to Ledger');
    // first check to see if the admin is already enrolled
    return fabric_client.getUserContext('admin', true);
}).then((user_from_store) => {
        if (user_from_store && user_from_store.isEnrolled()) {
        //   console.log('Successfully loaded admin from persistence');
        output.push('Successfully loaded admin from persistence');
        admin_user = user_from_store;
    } else {
        output.push('Failed to get admin.... run enrollAdmin.js');
        throw new Error('Failed to get admin.... run enrollAdmin.js');
    }

    // at this point we should have the admin user
    // first need to register the user with the CA server
    return fabric_ca_client.register({enrollmentID: username, affiliation: 'org1.department1',role: 'client'}, admin_user);
}).then((secret) => {
        // next we need to enroll the user with CA server
        //     console.log('Successfully registered user1 - secret:'+ secret);
        output.push('Successfully registered '+username+' - secret:'+ secret);
    return fabric_ca_client.enroll({enrollmentID: username, enrollmentSecret: secret});
}).then((enrollment) => {
        //console.log('Successfully enrolled member user ');
        output.push('Successfully enrolled member user '+username);
    return fabric_client.createUser(
        {username: username,
            mspid: organization,
            cryptoContent: { privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate }
        });

}).then((user) => {
        member_user = user;
    return fabric_client.setUserContext(member_user);
}).then(()=>{
        //    console.log('User1 was successfully registered and enrolled and is ready to intreact with the fabric network');
        output.push('User1 was successfully registered and enrolled and is ready to intreact with the fabric network');
    res.send({code:1,"msg":"", 'key':member_user._identity._certificate,'log':output});

}).catch((err) => {
        //  console.error('Failed to register: ' + err);
        output.push('Failed to register: ' + err);
    if(err.toString().indexOf('Authorization') > -1) {
        //console.error('Authorization failures may be caused by having admin credentials from a previous CA instance.\n' +
        //   'Try again after deleting the contents of the store directory '+store_path);
        output.push('Authorization failures may be caused by having admin credentials from a previous CA instance.\n' +
            'Try again after deleting the contents of the store directory '+store_path);
    }
    res.send({code:1,"msg":"", 'key':'','log':output});
});
};

