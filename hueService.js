'use strict';

const huejay = require('huejay');   // https://github.com/sqmk/huejay
const _ = require('lodash');    // https://lodash.com/docs

const config = require('./bridge.config');

function authenticate(client) {
    return client.bridge.isAuthenticated()
        .then(() => {
            return client;
        })
        .catch(error => {
            console.log('Could not authenticate');
        });
}

function connectAndAuthenticate(client) {
    return client.bridge.ping()
        .then(() => {
            return authenticate(client);
        })
        .catch(error => {
            console.log('Could not connect');
        });
}

function getBridgeClient() {
    return huejay.discover({ strategy: 'all' })
        .then(bridges => {
            if (!bridges.length) {
                console.log('- No bridges found');
                return;
            }

            const bridge = bridges[0];

            const client = new huejay.Client({
                host: bridge.ip,
                username: config.username
            });

            return client;
        })
        .catch(error => {
            console.log(`An error occurred: ${error.message}`);
        });
}

function getGroupByName(client, name) {
    return client.groups.getAll()
        .then(groups => {
            const group = _.find(groups, group => {
                return group.attributes.attributes['name'] === name;
            });

            return group;
        })
        .catch(error => {
            console.log(error);
        });
}

function toggleGroup(client, group) {
    const anyOn = group.state.attributes.any_on;

    console.log(`Any lights on: ${anyOn}. Setting all lights to: ${!anyOn}`);
    group.on = !anyOn;  // if any lights are on, set to off. if no lights are on, set to on
    client.groups.save(group);
}

module.exports = {
    connectAndAuthenticate: connectAndAuthenticate,
    getBridgeClient: getBridgeClient,
    getGroupByName: getGroupByName,
    toggleGroup: toggleGroup
};