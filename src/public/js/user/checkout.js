"use strict"

$(document).ready(function () {
    loadUserCartItem();
    confirmVerificationStatus();
})

var csrfToken = $('#_csrf').val();
var spinner = $('#tblLoader');
var cartQuantitySpan = $('#cartTotalQuantity');
var cartTotalAmountSpan = $('#cartTotalAmount');
var gcHeader = $('#gcHeader');
var gcHeaderText = $('#gcHeaderText');
var clearCartBtn = $('#clearCart');

var currentCartItem = [];

var isTouched = false;
var cartResponse = '';

function confirmVerificationStatus() {
    $.ajax({
        url: "/user/authcheck",
        method: "get",
        dataType: "json",
        headers: {
            "X-CSRF-TOKEN": csrfToken
        },
        success: function (response) {
            console.log(response.status);
            if (response.status != true) {
                swal("Account not verified", "Your account has to be verified to make transactions, click ok to verify now.", "info")
                    .then(val => {
                        window.location = '/user/profile';
                    })
            }
            authField.val("0123");
        }
    })
}

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

            currentCartItem = response.data.items
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
    const MAX_TRANSACTION_LIMIT = 300;

    var currentQuantity = Number(cartQuantitySpan.attr('data-qty'))
    var currentTotalPrice = Number(cartTotalAmountSpan.attr('data-pr'))

    var supposedNewPrice = currentTotalPrice + Number($(this).attr('data-pr'))

    if (supposedNewPrice > MAX_TRANSACTION_LIMIT) {
        // console.log("cannot");
        swal("Maximum transaction limit is $300", "Single transaction cannot exceed $300", "error");
        return false;
    }

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


            var newQuantity = currentQuantity + 1;
            var newPrice = currentTotalPrice + Number($(this).attr('data-pr'))
            cartQuantitySpan.text(newQuantity);
            cartTotalAmountSpan.text(newPrice);

            cartQuantitySpan.attr('data-qty', newQuantity)
            cartTotalAmountSpan.attr('data-pr', newPrice)
            // console.log(data)

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
    // console.log("reload cart item")
    // debugger
    fetch("/user/cartitem/", {
            method: 'GET',
            headers: {
                "X-CSRF-TOKEN": csrfToken
            }
        })
        .then(res => res.json())
        .then(res => {
            currentCartItem = res.data.items
            prepareCartInStore(res.data)

        })
        .catch(err => console.log(err))
}

function prepareCartInStore(data) {

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
    /* console.log(citemMarkupBundle);
     jhjkhjhjkh
     uhjkh'o*/
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
                // console.log("yea")
                var rwIdx = $(this).attr('data-idx');
                // console.log(rwIdx)
                let table = $('#cartTbl').DataTable();
                table.row(rwIdx).remove().draw(false);
            }

        })
})

$(document).on('click', '#proceedBtn', function () {
    var totalAmount = Number($('#cartTotalAmount').attr("data-pr"));

    // check if transaction can be made
    // fetch('/user/canmaketransaction', {
    //         method: "POST",
    //         body: totalAmount,
    //         headers: {
    //             "X-CSRF-TOKEN": csrfToken
    //         }
    //     })
    //     .then(res => res.json())
    //     .then(response => {
    //         console.log(response.data)
    //     })
    var payload = {
        totalAmount
    }

    $.ajax({
        url: "/user/canmaketransaction",
        method: "POST",
        dataType: "json",
        data: payload,
        headers: {
            "X-CSRF-TOKEN": csrfToken
        },
        success: function (response) {
            displayTransactionBox(response.data)
        }
    })

    // 
})

var displayTransactionBox = function (canProceedWithTransaction) {
    if (canProceedWithTransaction)
        $("#optionModal").modal("show")
    else {
        // console.log("error")
        swal("Transacion quota reached for today", "Cannot go beyond $500 transaction per day", "error");
        return false;
    }
}

var initiatePayPalPayment = function () {
    var totalAmount = $('#cartTotalAmount').attr("data-pr")

    var items = []

    currentCartItem.forEach(item => {
        var arr = []
        var {
            id,
            quantity,
            total,
            createdAt
        } = item
        var newItemForm = {
            "name": item.giftCodeCategory.title,
            "sku": "gcode",
            "price": item.giftCodeCategory.sellingPrice,
            "currency": "USD",
            "quantity": quantity
        }
        items.push(newItemForm)
    })

    var payload = {
        items,
        totalAmount
    }

    fetch('/user/pay', {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken
            }
        })
        .then(res => res.json())
        .then(response => {
            window.location.href = response.data
        })
}

var initiateBankDepositProcessing = function () {
    var totalAmount = $('#cartTotalAmount').attr("data-pr")
    $('#totalAmount').val(totalAmount)

    let orderFrm = document.getElementById("orderForm");
    let formData = new FormData(orderFrm)

    fetch('/user/order', {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRF-TOKEN": csrfToken
            }
        })
        .then(res => res.json())
        .then(response => {
            if (response.status === "false") {
                $('#statusModal').modal("hide")
                swal(response.data, "", "error")
                    .then(val => {
                        $("#optionModal").modal("show")
                    })
            } else if (response.status === "true") {
                swal("Transaction has been posted", "Transaction will be reviewed and processed", "success")
                    .then(val => {
                        window.location.href = "/user/store";
                    })
            }
        })
}

$("input[name='m_option_1']").on('click', function () {
    var paymentOption = $("input[name='m_option_1']:checked").val();
    var paymentInfoSpan = $("#paymentInfoSpan");

    if (paymentOption === "bank") {
        paymentInfoSpan.show("slideIn")
    } else if (paymentOption === "paypal") {
        paymentInfoSpan.hide("fadeOut")
    }
})

$("#triggerPay").on('click', function () {
    var totalAmount = Number($('#cartTotalAmount').attr("data-pr"))

    if (totalAmount <= 0) {
        swal("Your cart is empty", "", "error");
        return false;
    }

    $("#optionModal").modal("hide")
    $('#statusModal').modal("show")
    var paymentOption = $("input[name='m_option_1']:checked").val();

    if (paymentOption === "paypal") {

        initiatePayPalPayment();
    } else if (paymentOption === "bank") {
        initiateBankDepositProcessing();
    }
})