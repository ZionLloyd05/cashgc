"use strict"

var cart = $('#cart_no');
var csrfToken = $("#_csrf").val();

$(document).ready(function () {
    console.log("yaay")
    fetch("/user/cartitem/count", {
            method: 'GET',
            headers: {
                "X-CSRF-TOKEN": csrfToken
            }
        })
        .then(res => res.json())
        .then(res => {
            cart.text(res.data)
        })
        .catch(err => console.log(err))
})