"use strict";

function getService(serviceID) {
    var ServiceRegistry = dw.svc.ServiceRegistry;
    var LocalServiceRegistry = dw.svc.LocalServiceRegistry;
    var ServiceCallback = {
        createRequest: function(service, params) {
            var serviceCredential = service.getConfiguration().getCredential();
            var URL = serviceCredential.getURL();
            service.setURL(URL);
            service.setRequestMethod("GET");
    
            return JSON.stringify(params);
        },
        parseResponse: function(service, response) {
            var responseObj = null;
    
            if (response.statusMessage === "OK") {
                try {
                    responseObj = JSON.parse(response.text);
                } catch (e) {
                    logger.error("An error occurred: {0}. Response: {1}", e, response.text);
                }
            }
    
            return responseObj;
        }
    };
    var service = ServiceRegistry.get(serviceID);
    if (service) {
        return LocalServiceRegistry.createService(serviceID, ServiceCallback);
    }

    return null;
}

var server = require("server");

server.get("Show", function(req, res, next) {
    var service = getService("app_training.http.products.get");
    var result = service.call();
    var content;
    if (result.ok) {
        content = service.getResponse();
    }
    res.render("components/productSearchHits", {
        products: content.hits
    });
    next();
});

module.exports = server.exports();
