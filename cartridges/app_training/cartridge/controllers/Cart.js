"use strict";

var server = require("server");
server.extend(require("../../../app_storefront_base/cartridge/controllers/Cart"));

server.getRoute("Show").append(function(req, res, next) {
    var Site = require("dw/system/Site");
    var currentSite = Site.getCurrent();
    var thresholdPrice = currentSite.getCustomPreferenceValue("thresholdPrice");
    var BasketMgr = require('dw/order/BasketMgr');
    var currentBasket = BasketMgr.getCurrentBasket();
    var grandTotal = currentBasket.totalGrossPrice.decimalValue;
    res.setViewData({
        thresholdPrice: thresholdPrice,
        grandTotal: grandTotal
    });
    next();
});

module.exports = server.exports();