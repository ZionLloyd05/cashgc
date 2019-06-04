"use strict"

$(document).ready(function () {
    loadUserCartItem()
})

var csrfToken = $('#_csrf').val();
var spinner = $('#tblLoader');
var cartQuantitySpan = $('#cartTotalQuantity');
var cartTotalAmountSpan = $('#cartTotalAmount');
var gcHeader = $('#gcHeader');
var gcHeaderText = $('#gcHeaderText');

var cartResponse = '';

var loadUserCartItem = function () {
    spinner.show();
    $.ajax({
        url: "/user/cartitem/",
        method: "GET",
        dataType: "json",
        header: {
            "X-CSRF-TOKEN": csrfToken
        },
        success: function (response) {
            cartResponse = response.data.items;
            cartQuantitySpan.text(response.data.totalQuantity)
            cartTotalAmountSpan.text((response.data.totalPrice).toLocaleString())
            bindTableToData(response.data.items)
        }
    })
}

var cartTbl;
var bindTableToData = function (response) {
    cartTbl = $("#cartTbl").DataTable({
        aaData: response,
        aoColumns: [{
                data: "id",
                render: function (id, type, row, meta) {
                    return meta.row + 1;
                }
            },
            {
                data: "giftCodeCategory.title",
                render: function (data, type, row, meta) {
                    return `${data} gift code`
                }
            },
            {
                data: "giftCodeCategory.sellingPrice"
            },
            {
                data: "quantity"
            },
            {
                data: "total"
            },
            {
                data: "id",
                render: function (id, type, row, meta) {
                    return `
                            <i class="fa fa-minus-circle"></i>&nbsp;
                            <i class="fa fa-plus-circle"></i>&nbsp;
                            <i class="fa fa-trash-alt"></i>&nbsp;
                        `
                }
            }
        ]
    })
    spinner.hide();
};

/**
 * Checkout Functionality
 */
$("#checkoutBtn").on('click', function () {
    $(this).addClass("kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--primary");
    /**
     * @TODO Create a Transaction object
     * and tie all giftcode generated to that transaction.
     */
    scaffoldCodes(cartResponse);
});


var scaffoldCodes = function (cartResponse) {
    gcHeader.addClass("kt-spinner kt-spinner--v2 kt-spinner--md kt-spinner--info");
    gcHeaderText.text("Preparing your gift codes...")
    var csrfToken = $('#_csrf').val();
    let payload = cartResponse;

    fetch("/user/giftcode", {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            $("#checkoutBtn").removeClass("kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--primary");
            bindGiftCodeData(data.data);
            $('#exampleModalTooltips').modal("show");
        });
}

var gcTbl;
var bindGiftCodeData = function (data) {
    let flattenData = data.flat();
    console.log(flattenData);
    gcTbl = $("#gcTbl").DataTable({
        "iDisplayLength": 5,
        aaData: flattenData,
        aoColumns: [{
            data: "title",
            render: function (id, type, row, meta) {
                return meta.row + 1;
            }
        }, {
            data: "title"
        }, {
            data: "giftCode"
        }]
    })
    gcHeader.removeClass("kt-spinner kt-spinner--v2 kt-spinner--md kt-spinner--info")
    gcHeaderText.html("Note: You can access your Gift Codes here <a href='/user/mycodes'>My Codes</a>")
}