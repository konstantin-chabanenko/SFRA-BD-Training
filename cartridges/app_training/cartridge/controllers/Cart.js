"use strict";

function sendProductEmail(email, productId) {
    var ProductMgr = require("dw/catalog/ProductMgr");
    var Resource = require('dw/web/Resource');
    var Mail = require('dw/net/Mail');
    var Template = require('dw/util/Template');
    var Site = require('dw/system/Site');
    var HashMap = require('dw/util/HashMap');

    var product = ProductMgr.getProduct(productId);
    var t = 0;
    var objForProduct = {
        productImage: product.getImage(),
        productId: product.getId(),
        productDescription: product.getLongDescription() 
    };
    var context = new HashMap();
    // Object.keys(objForProduct).forEach(function(key) {
    //     context.put(key, objForProduct[key])
    // });
    context.put("productImage", objForProduct.productImage);
    context.put("productId", objForProduct.productId);
    context.put("productDescription", objForProduct.productDescription);
    var productEmail = new Mail();
    productEmail.addTo(email);
    productEmail.setFrom(Site.current.getCustomPreferenceValue('customerServiceEmail')
    || 'no-reply@salesforce.com');
    productEmail.setSubject(Resource.msg("email.subject", "cart", null));
    var template = new Template('mail.isml');
    var content = template.render(context).text;
    productEmail.setContent(content, 'text/html', 'UTF-8');
    productEmail.send();
}

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

server.getRoute("AddProduct").append(function(req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var customer = BasketMgr.currentBasket.customer;
    var email = customer.profile.email;
    var productId = req.form.pid;
    if (email !== null) {
        sendProductEmail(email, productId);
    }
    next();
});

module.exports = server.exports();