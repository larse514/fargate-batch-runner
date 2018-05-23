'use strict';
const winston = require('winston');

winston.info('Loading function');

const aws = require('aws-sdk');

var ecs = new aws.ECS({apiVersion: '2014-11-13'});

const task = require('./src/ecs/task');
const config = require('./src/config/config')

exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    let params = task.createDefinition(bucket, key, config);

    winston.info(params)
    
    ecs.runTask(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });
};