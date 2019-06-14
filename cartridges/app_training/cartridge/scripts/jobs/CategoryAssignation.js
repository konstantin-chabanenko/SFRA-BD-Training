function execute(params) {
    var ProductSearchModel = require("dw/catalog/ProductSearchModel");
    var apiProductSearch = new ProductSearchModel();
    apiProductSearch.addRefinementValues('brand', params.brand);
    apiProductSearch.search();
    var products = apiProductSearch.getProductSearchHits().asList().toArray();
    var File = require("dw/io/File");
    var XMLStreamWriter = require("dw/io/XMLStreamWriter");
    var file = new File(File.IMPEX + '/src/instance/CategoryAssignment.xml');
    var FileWriter = require("dw/io/FileWriter");
    var fileWriter = new FileWriter(file, "UTF-8");
    var xsw = new XMLStreamWriter(fileWriter);
    xsw.writeStartDocument();
    xsw.writeStartElement("catalog");
    xsw.writeAttribute("xmlns", "http://www.demandware.com/xml/impex/catalog/2006-10-31");
    xsw.writeAttribute("catalog-id", "storefront-catalog-m-en");
        products.forEach(function(product) {
            xsw.writeStartElement("category-assignment");
            xsw.writeAttribute("category-id", params.categoryId);
            xsw.writeAttribute("product-id", product.productID);
            xsw.writeStartElement("primary-flag");
                xsw.writeCharacters("true");
            xsw.writeEndElement();
            xsw.writeEndElement();
        });
    xsw.writeEndElement();
    xsw.writeEndDocument();
   
    xsw.close();
    fileWriter.close();
    file.createNewFile();
    return PIPELET_NEXT;
}

module.exports.execute = execute;