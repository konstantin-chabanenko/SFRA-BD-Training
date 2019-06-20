"use strict";

function sendMail(email, fullName, couponCode) {
    var template = new dw.util.Template("newsletter/newsletterEmail");
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

server.get("Show",
    function(req, res, next) {
    var URLUtils = require("dw/web/URLUtils");
    var form = server.forms.getForm('newsletter');

    form.clear();
    res.render('newsletter/newsletter', {
        CurrentForm: form,
        ContinueURL: URLUtils.url("Newsletter-HandleForm").toString()
    });
    next();
});

server.post(
    "HandleForm",
    function(req, res, next) {
    var CustomObjectMgr = require("dw/object/CustomObjectMgr");
    var formErrors = require('*/cartridge/scripts/formErrors');
    var URLUtils = require('dw/web/URLUtils');
    var Resource = require('dw/web/Resource');
    var form = server.forms.getForm('newsletter');
    var t = 0;
    if (CustomObjectMgr.getCustomObject('NewsletterForm', form.email.htmlValue) != null) {
        form.valid = false;
        form.email.valid = false;
        form.email.error = Resource.msg('error.message.username.invalid', 'forms', null);
    }
    if (form.valid) {
        res.json({
            success: true,
            redirectUrl: URLUtils.url('Newsletter-Submited').toString()
        });
    } else {
        res.json({
            success: false,
            fieldErrors: formErrors.getFormErrors(form)
        })
    }
    next();
})

server.get(
    "Submited",
    function(req, res, next) {
        var CouponMgr = require("dw/campaign/CouponMgr");
        var Coupon = CouponMgr.getCoupon("20%offForEachOrder");
        var CustomObjectMgr = require("dw/object/CustomObjectMgr");
        var Transaction = require('dw/system/Transaction');
        var URLUtils = require('dw/web/URLUtils');
        var form = server.forms.getForm('newsletter');
        var couponCode;
        Transaction.wrap(function() {
            CustomObjectMgr.createCustomObject('NewsletterForm', form.email.htmlValue);
            couponCode = Coupon.getNextCouponCode();
        });
        var fullName = form.fname.htmlValue + ' ' + form.lname.htmlValue;
        sendMail(form.email.htmlValue, fullName, couponCode);
        res.redirect(URLUtils.url('Home-Show'));
        next();
    }
)

module.exports = server.exports();
