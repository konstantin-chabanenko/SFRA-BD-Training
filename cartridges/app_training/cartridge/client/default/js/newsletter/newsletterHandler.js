"use strict";

var formHelpers = require('../checkout/formErrors');

function getModalHtmlElement(redirectUrl) {
    if ($('#newsletterModal').length !== 0) {
        $('#newsletterModal').remove();
    }
    var htmlString = '<!-- Modal -->'
        + '<div class="modal" id="newsletterModal" role="dialog">'
        + '<div class="modal-dialog quick-view-dialog">'
        + '<!-- Modal content-->'
        + '<div class="modal-content">'
        + '<div class="modal-header">'
        +     '<h3>Confirm Subscription</h3>'
        +     '<button type="button" class="close close-modal pull-right" data-dismiss="modal">'
        +         '&times;'
        +     '</button>'
        + '</div>'
        + '<div class="modal-body">Please click OK to confirm your subscription</div>'
        + '<div class="modal-footer">'
        +     '<button class="close-modal btn btn-outline-primary">Cancel</button>'
        +     '<a href="' + redirectUrl + '" class="btn btn-primary confirm">Yes</a>'
        +   '</div>'
        + '</div>'
        + '</div>'
        + '</div>';
    $('body').append(htmlString);
}

module.exports = {
    newsletter: function() {
        $("form.newsletter-subscription").submit(function(e) {
            e.preventDefault();
            var $form = $(this);
            $form.spinner().start();
            $.ajax({
                url: $form.attr('action'),
                type: "POST",
                dataType: 'json',
                data: $($form).serialize(),
                success: function(response) {
                    $form.spinner().stop();
                    if (!response.success) {
                        if (Object.keys(response.fieldErrors).length) {
                            formHelpers.loadFormErrors('.newsletter-subscription', response.fieldErrors);
                        }
                    } else {
                        $('.modal-background').show();
                        getModalHtmlElement(response.redirectUrl);
                        let $modal_window = $('#newsletterModal');
                        $modal_window.show();
                        $modal_window.on('click', '.close-modal', function(e) {
                            $modal_window.hide();
                            $('.modal-background').hide();
                        });
                    }
                },
                error: function (err) {
                    if (err.responseJSON.redirectUrl) {
                        window.location.href = err.responseJSON.redirectUrl;
                    }
                    $form.spinner().stop();
                }         
            });
        });
    }
};
