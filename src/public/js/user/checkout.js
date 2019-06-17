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
var clearCartBtn = $('#clearCart');

var isTouched = false;
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
            cartQuantitySpan.attr('data-qty', response.data.totalQuantity)

            cartTotalAmountSpan.text((response.data.totalPrice).toLocaleString())
            cartTotalAmountSpan.attr('data-pr', response.data.totalPrice)

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
                data: "id",
                render: function (giftCodeCategory, type, row, meta) {
                    return `${row.giftCodeCategory.title} gift code`
                }
            },
            {
                data: "id",
                render: function (giftCodeCategory, type, row, meta) {
                    return `${row.giftCodeCategory.sellingPrice}`
                }
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
                            <i data-idx='${meta.row}' data-pr="${row.giftCodeCategory.sellingPrice}" data-gcc="${row.giftCodeCategory.id}" style="cursor:pointer" class="fa fa-minus-circle" id="minus"></i>&nbsp;
                            <i data-idx='${meta.row}' data-pr="${row.giftCodeCategory.sellingPrice}" data-gcc="${row.giftCodeCategory.id}" class="fa fa-plus-circle"  style="cursor:pointer" id="add"></i>&nbsp;
                        `
                }
            }
        ]
    })
    spinner.hide();
}


$(document).on('click', '#add', function () {
    isTouched = true;
    var gcId = $(this).attr('data-gcc');

    let payload = {
        gcId,
        qty: 1
    }

    fetch("/user/cartitem", {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken
            }
        })
        .then(res => res.json())
        .then(data => {
            reloadCartItem()


            /**
             * Re-calculate total qty and price
             */

            var currentQuantity = Number(cartQuantitySpan.attr('data-qty'))
            var currentTotalPrice = Number(cartTotalAmountSpan.attr('data-pr'))

            var newQuantity = currentQuantity + 1;
            var newPrice = currentTotalPrice + Number($(this).attr('data-pr'))
            cartQuantitySpan.text(newQuantity);
            cartTotalAmountSpan.text(newPrice);

            cartQuantitySpan.attr('data-qty', newQuantity)
            cartTotalAmountSpan.attr('data-pr', newPrice)
            console.log(data)

            var rwIdx = $(this).attr('data-idx');
            let table = $("#cartTbl").DataTable();
            // console.log(rwIdx)
            let tempData = cartTbl.row(parseInt(rwIdx));

            var currentRow = table.row(rwIdx).node();
            table.cell(currentRow, 0).data(rwIdx + 1)

            tempData['id'] = data.data.id;
            tempData['giftCodeCategory'] = data.data.giftCodeCategory;
            tempData['quantity'] = data.data.quantity;
            tempData['total'] = data.data.total;

            // console.log(tempData)
            table.row(parseInt(rwIdx)).data(tempData) //this is to update the data in the row cells
            var currentRow = table.row(rwIdx).node()
            table.cell(currentRow, 0).data(rwIdx + 1) //this is to set the S/N field
            table.draw(false)
        })
})

function reloadCartItem() {
    console.log("reload cart item")
    // debugger
    fetch("/user/cartitem/", {
            method: 'GET',
            headers: {
                "X-CSRF-TOKEN": csrfToken
            }
        })
        .then(res => res.json())
        .then(res => {

            prepareCartInStore(res.data)

        })
        .catch(err => console.log(err))
}

function prepareCartInStore(data) {
    console.log("preparing in store")
    let {
        items,
        totalQuantity,
        totalPrice
    } = data;

    cart.text(totalQuantity)
    let itemString = '';

    (totalQuantity > 1) ? itemString = `${totalQuantity} cart items`: itemString = `${totalQuantity} cart item`

    cartItemTotal.text(itemString);
    // total && total.text(totalPrice)

    let citemMarkupBundle = '';
    cartItemBody.empty();
    // console.log(items.length)
    if (items.length > 0) {
        items.forEach(item => {
            let {
                giftCodeCategory
            } = item;
            citemMarkupBundle += `
                    <a href="#" class="kt-notification__item">
                        <div class="kt-notification__item-icon">
                            <i class="flaticon2-line-chart kt-font-success"></i>
                        </div>
                        <div class="kt-notification__item-details">
                            <div class="kt-notification__item-title">
                                ${giftCodeCategory.title} Gift Code
                            </div>
                            <div class="kt-notification__item-time">
                                2 hrs ago
                            </div>
                        </div>
                        <div class="kt-notification__item-icon">
                            + ${item.quantity}
                        </div>
                    </a>
                   
            `
        });

        citemMarkupBundle += `
            <div class="kt-notification__item">
                <a href="/user/cart" class="btn btn-block btn-brand">
                    <i class="flaticon2-shopping-cart-1"></i>
                    <span class="kt-hidden-mobile">Checkout</span>
                </a>
            </div>
        `
    } else {
        citemMarkupBundle = `
            <div class="kt-notification__item">
            <div class="kt-notification__item-icon">
            <i class="far fa-frown"></i>
        </div>
        <div class="kt-notification__item-details">
            <div class="kt-notification__item-title">
                Oops, Cart's Empty!
            </div>
        </div>
            </div>
        `
    }
    // console.log(citemMarkupBundle);
    cartItemBody.html(citemMarkupBundle);
}

$(document).on('click', '#minus', function () {
    isTouched = true;
    var gccId = $(this).attr("data-gcc");


    fetch('/user/cartitem/' + gccId, {
            method: "GET",
            headers: {
                "X-CSRF-TOKEN": csrfToken
            }
        }).then(res => res.json())
        .then(data => {
            /**
             * Reload user top cart
             */
            reloadCartItem()

            /**
             * Re-calculate total qty and price
             */

            var currentQuantity = Number(cartQuantitySpan.attr('data-qty'))
            var currentTotalPrice = Number(cartTotalAmountSpan.attr('data-pr'))

            var newQuantity = currentQuantity - 1;
            var newPrice = currentTotalPrice - Number($(this).attr('data-pr'))
            cartQuantitySpan.text(newQuantity);
            cartTotalAmountSpan.text(newPrice);

            cartQuantitySpan.attr('data-qty', newQuantity)
            cartTotalAmountSpan.attr('data-pr', newPrice)

            /**
             * Manipulate table dom realtime
             */
            if (data.status && data.status !== null) {
                var rwIdx = $(this).attr('data-idx');
                let table = $("#cartTbl").DataTable();
                // console.log(rwIdx)
                let tempData = cartTbl.row(parseInt(rwIdx));

                var currentRow = table.row(rwIdx).node();
                table.cell(currentRow, 0).data(rwIdx + 1)

                tempData['id'] = data.status.id;
                tempData['giftCodeCategory'] = data.status.giftCodeCategory;
                tempData['quantity'] = data.status.quantity;
                tempData['total'] = data.status.total;

                // console.log(tempData)
                table.row(parseInt(rwIdx)).data(tempData) //this is to update the data in the row cells
                var currentRow = table.row(rwIdx).node()
                table.cell(currentRow, 0).data(rwIdx + 1) //this is to set the S/N field
                table.draw(false)
            } else if (data.status === null) {
                console.log("yea")
                var rwIdx = $(this).attr('data-idx');
                console.log(rwIdx)
                let table = $('#cartTbl').DataTable();
                table.row(rwIdx).remove().draw(false);
            }

        })
})

/**
 * Checkout Functionality
 */
$("#checkoutBtn").on('click', function () {
    $(this).addClass("kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--primary");

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

            let giftCodes = data.data;
            createDummyTransaction(giftCodes);
            // $("#checkoutBtn").removeClass("kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--primary");
            bindGiftCodeData(data.data);
            // $('#exampleModalTooltips').modal("show");
        });
}

var createDummyTransaction = function (data) {
    var flattenCodes = data.flat();
    var gcodes = [];
    flattenCodes.forEach(codes => {
        gcodes.push(codes.giftCodeObj.id)
    })
    let transactionPayload = {
        status: 0,
        type: 0,
        gcodes
    }
    console.log(transactionPayload);
    fetch('/user/transaction', {
            method: "POST",
            body: JSON.stringify(transactionPayload),
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken
            }
        })
        .then(res => res.json())
        .then(data => {
            $("#checkoutBtn").removeClass("kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--primary");
            $('#exampleModalTooltips').modal("show");
            clearCart();
        })
}

var clearCart = function () {
    fetch('/user/cartitem', {
        method: "DELETE",
        headers: {
            "X-CSRF-TOKEN": csrfToken
        }
    })
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
            data: "giftCodeObj.code"
        }]
    })
    gcHeader.removeClass("kt-spinner kt-spinner--v2 kt-spinner--md kt-spinner--info")
    gcHeaderText.html("Note: You can access your Gift Codes here <a href='/user/my-codes'>My Codes</a>")
}

$(document).click('#triggerPay', function () {
    var totalAmount = $('#cartTotalAmount').attr("data-pr")
    console.log(totalAmount)

    paypal.Buttons({
        createOrder: function (data, actions) {
            // Set up the transaction
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: totalAmount
                    }
                }]
            });
        },
        onApprove: function (data, actions) {
            // Capture the funds from the transaction
            return actions.order.capture().then(function (details) {
                // Show a success message to your buyer
                console.log(details)
                swal('Transaction completed by ' + details.payer.name.given_name, '', 'success')
                //alert('Transaction completed by ' + details.payer.name.given_name);

                // fetch('user/paypal-transaction-complete', {
                //     method: 'post',
                //     headers: {
                //         'content-type': 'application/json'
                //     },
                //     body: JSON.stringify({
                //         orderID: data.orderID,
                //         amountToPay: totalAmount
                //     })
                // }).then(res => {
                //     console.log(res)
                // })
            });
        }
    }).render('#paypal-button-container');

    $('#payModal').modal('show');
})