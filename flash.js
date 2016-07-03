'use strict';

const hue = require('./hueService');

// this initializes connection to Hue bridge and toggles a single group on/off
(() => {
    hue.getBridgeClient()
        .then(client => {
            hue.connectAndAuthenticate(client)
                .then(client => {
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