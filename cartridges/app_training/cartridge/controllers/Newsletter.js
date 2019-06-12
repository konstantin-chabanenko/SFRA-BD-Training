"use strict";

function sendMail(email, fullName, couponCode) {
    var template = new dw.util.Template("newsletterEmail");
    var context = new dw.util.HashMap();
    context.put("email", email);
    context.put("fullName", fullName);
    context.put("couponCode", couponCode);
    var content = template.render(context).text;

    var mail = new dw.net.Mail();
    mail.addTo(email);
    mail.setFrom("no-reply@salesforce.com");
    mail.setSubject("Newsletter Subscription");
    mail.setContent(content, 'text/html', 'UTF-8');

    mail.send();
}

var server = require("server");

server.get("Show", function(req, res, next) {
    var URLUtils = require("dw/web/URLUtils");

    var form = server.forms.getForm('newsletter');
    form.clear();
    res.render('newsletter', {
        CurrentForm: form,
        ContinueURL: URLUtils.url("Newsletter-HandleForm")
    });
    next();
});

server.post("HandleForm", function(req, res, next) {
    var CouponMgr = require("dw/campaign/CouponMgr");
    var Coupon = CouponMgr.getCoupon("20%offForEachOrder");
    var CustomObjectMgr = require("dw/object/CustomObjectMgr");

    var couponCode;
    var form = server.forms.getForm('newsletter');
    var Transaction = require('dw/system/Transaction');
    if (form.valid) {
        var form = session.forms.newsletter;
        var fullName = form.fname.htmlValue + ' ' + form.lname.htmlValue;
        Transaction.wrap(function() {
            CustomObjectMgr.createCustomObject('NewsletterForm', form.email.htmlValue.toString());
            couponCode = Coupon.getNextCouponCode();
        });
        sendMail(form.email.htmlValue, fullName, couponCode);
    }
    next();
})

module.exports = server.exports();
