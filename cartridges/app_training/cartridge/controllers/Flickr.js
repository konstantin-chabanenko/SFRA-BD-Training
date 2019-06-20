"use strict";

var server = require("server");

server.get(
    "Show",
    function(req, res, next) {
        var HTTPClient = require("dw/net/HTTPClient");
        var httpClient = new HTTPClient();
        var message;
        httpClient.open('GET', 'https://www.flickr.com/services/feeds/photos_public.gne?format=json&nojsoncallback=?');
        httpClient.send();
        if (httpClient.statusCode == 200)
        {
             message = JSON.parse(httpClient.text);
        }
        else
        {
            // error handling
            message = "An error occurred with status code " + httpClient.statusCode;
        }
        res.render('flickr/flickrImgs', {
            content: message
        });
        next();
    }
);

module.exports = server.exports();
