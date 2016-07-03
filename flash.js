'use strict';

const config = require('./bridge.config');
const hue = require('./hueService');

// this initializes connection to Hue bridge and toggles a single group on/off
(() => {
    hue.getBridgeClient(config)
        .then(client => {
            hue.ensureConnectedAndAuthenticated(client)
                .then(() => {
                    hue.getGroupByName(client, 'Kitchen')
                        .then(group => {
                            hue.toggleGroup(client, group);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                })
                .catch(error => {
                    console.log(error);
                });
        })
        .catch(error => {
            console.log(error);
        });
})();