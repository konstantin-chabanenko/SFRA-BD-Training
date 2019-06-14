function execute(params) {
    var OrderMgr = require("dw/order/OrderMgr");
    var Order = require("dw/order/Order");
    var orders = OrderMgr.searchOrders("exportStatus = {0}", null, Order.EXPORT_STATUS_NOTEXPORTED).asList().toArray();
    var File = require("dw/io/File");
    var file = new File(File.IMPEX + "/src/exports/orders_export.xml");
    var FileWriter = require("dw/io/FileWriter");
    var XMLStreamWriter = require("dw/io/XMLStreamWriter");
    var fileWriter = new FileWriter(file);
    var xsw = new XMLStreamWriter(fileWriter);

    xsw.writeStartDocument();
        xsw.writeStartElement("orders");
            xsw.writeAttribute("xmlns", "http://www.demandware.com/xml/impex/order/2006-10-31");
            orders.forEach(function(order) {
                xsw.writeStartElement("order");
                    xsw.writeAttribute("order-no", order.orderNo);
                    xsw.writeStartElement("order-date");
                        xsw.writeCharacters(order.getCreationDate());
                    xsw.writeEndElement();
                    xsw.writeStartElement("customer");
                        xsw.writeStartElement("customer-name");
                            xsw.writeCharacters(order.getCustomerName());
                        xsw.writeEndElement();
                        xsw.writeStartElement("customer-email");
                            xsw.writeCharacters(order.getCustomerEmail());
                        xsw.writeEndElement();
                    xsw.writeEndElement();
                    xsw.writeStartElement("payments");
                        xsw.writeStartElement("payment");
                            xsw.writeStartElement("credit-card");
                                xsw.writeStartElement("card-type");
                                    xsw.writeCharacters(order.getPaymentInstrument().getCreditCardType());
                                xsw.writeEndElement();
                                xsw.writeStartElement("card-number");
                                    xsw.writeCharacters(order.getPaymentInstrument().getCreditCardNumber());
                                xsw.writeEndElement();
                                xsw.writeStartElement("card-holder");
                                    xsw.writeCharacters(order.getPaymentInstrument().getCreditCardHolder());
                                xsw.writeEndElement();
                                xsw.writeStartElement("expiration-month");
                                    xsw.writeCharacters(order.getPaymentInstrument().getCreditCardExpirationMonth());
                                xsw.writeEndElement();
                                xsw.writeStartElement("expiration-year");
                                    xsw.writeCharacters(order.getPaymentInstrument().getCreditCardExpirationYear());
                                xsw.writeEndElement();
                            xsw.writeEndElement();
                        xsw.writeEndElement();
                    xsw.writeEndElement();
                    xsw.writeStartElement("product-lineitems");
                        order.getAllProductLineItems().toArray().forEach(function(product) {
                            xsw.writeStartElement("product-lineitem");
                                xsw.writeStartElement("product-id");
                                    xsw.writeCharacters(product.productID);
                                xsw.writeEndElement();
                            xsw.writeEndElement();
                        });
                    xsw.writeEndElement();

                xsw.writeEndElement();
            });
        xsw.writeEndElement();
    xsw.writeEndDocument();

    xsw.close();
    fileWriter.close();
    file.createNewFile();
}

module.exports.execute = execute;
