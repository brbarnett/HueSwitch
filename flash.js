'use strict';

const huejay = require('huejay');   // https://github.com/sqmk/huejay
const _ = require('lodash');    // https://lodash.com/docs

const config = require('./bridge.config');

huejay.discover()
    .then(bridges => {
        const bridge = bridges[0];

        let client = new huejay.Client({
            host: bridge.ip,
            username: config.username
        });

        client.bridge.ping()
            .then(authenticate(client, () => {
                client.groups.getAll()
                .then(groups => {
                    const kitchen = _.find(groups, group => {
                        return group.attributes.attributes['name'] === 'Kitchen';
                    });

                    kitchen.on = false;
                    console.log('Turning lights off');
                    client.groups.save(kitchen);

                    setTimeout(() => {
                        kitchen.on = true;
                        console.log('Turning lights on');
                        client.groups.save(kitchen);
                    }, 2000);
                })
                .catch(error => {
                    console.log(error);
                });
            }))
            .catch(error => {
                console.log('Could not connect');
            });
    })
    .catch(error => {
        console.log(`An error occurred: ${error.message}`);
    });

function authenticate(client, callback) {
    console.log('Successful connection');

    client.bridge.isAuthenticated()
        .then(() => {
            console.log('Successful authentication');

            callback();
        })
        .catch(error => {
            console.log('Could not authenticate');
        });
}