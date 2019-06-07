"use strict";

var server = require('server');
server.extend(require('../../../app_storefront_base/cartridge/controllers/Product'));

server.getRoute('Show').append(function(req, res, next) {
    var ProductMgr = require("dw/catalog/ProductMgr");
    var product = ProductMgr.getProduct(res.viewData.product.id);

    var primaryCategory = product.getPrimaryCategory().getID();
    var CatalogMgr = require('dw/catalog/CatalogMgr');
    var sortingRule = CatalogMgr.getSortingRule('price-low-to-high');
    var PagingModel = require('dw/web/PagingModel');
    var ProductSearchModel = require("dw/catalog/ProductSearchModel");
    var productSearchModel = new ProductSearchModel();
    productSearchModel.setSortingRule(sortingRule);
    productSearchModel.setCategoryID(primaryCategory);
    productSearchModel.search();

    var psm_count = productSearchModel.count;
    
    var iterator = productSearchModel.getProductSearchHits();
    var pdm = new PagingModel(iterator, psm_count);

    pdm.setStart(0);
    pdm.setPageSize(4);

    var sorted = pdm.pageElements.asList();
    var viewData = res.getViewData();
    viewData.sorted = sorted;
    res.setViewData(viewData);
    next();
});

module.exports = server.exports();
