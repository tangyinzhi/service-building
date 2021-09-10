define([
    './Credit',
    './defined',
    './Resource'
], function (
    Credit,
    defined,
    Resource) {
    'use strict';

    var defaultTokenCredit;
    var defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0NjA1MGJkOS1mNjk2LTQwYWMtYTkxMi1lZGIzZWNjNjI0ZWEiLCJpZCI6MjU5LCJzY29wZXMiOlsiYXNyIiwiZ2MiXSwiaWF0IjoxNTU2NzIzNzE3fQ.hujJ-wMWiVAv65Pb49rstfekinqrqZRHU9OfPbMnIL8';

    /**
     * Default settings for accessing the Cesium ion API.
     * @exports Ion
     *
     * An ion access token is only required if you are using any ion related APIs.
     * A default access token is provided for evaluation purposes only.
     * Sign up for a free ion account and get your own access token at {@link https://cesium.com}
     *
     * @see IonResource
     * @see IonImageryProvider
     * @see IonGeocoderService
     * @see createWorldImagery
     * @see createWorldTerrain
     */
    var Ion = {};

    /**
     * Gets or sets the default Cesium ion access token.
     *
     * @type {String}
     */
    Ion.defaultAccessToken = defaultAccessToken;

    /**
     * Gets or sets the default Cesium ion server.
     *
     * @type {String|Resource}
     * @default https://api.cesium.com
     */
    Ion.defaultServer = new Resource({url: 'https://api.cesium.com/'});

    Ion.getDefaultTokenCredit = function (providedKey) {
        if (providedKey !== defaultAccessToken) {
            return undefined;
        }

        if (!defined(defaultTokenCredit)) {
            var defaultTokenMessage = '<b> \
            This application is using Cesium\'s default ion access token. Please assign <i>Cesium.Ion.defaultAccessToken</i> \
            with an access token from your ion account before making any Cesium API calls. \
            You can sign up for a free ion account at <a href="https://cesium.com">https://cesium.com</a>.</b>';

            defaultTokenCredit = new Credit(defaultTokenMessage, true);
        }

        return defaultTokenCredit;
    };

    return Ion;
});
