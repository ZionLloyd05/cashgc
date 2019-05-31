"use strict"

$(document).ready(function () {
    loadUserCartItem()
})

var csrfToken = $('#_csrf').val();
var spinner = $('#tblLoader');

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
            bindTableToData(response.data.items);
            // let {
            //     items
            // } = response.data;
            // console.log(items[0].giftCodeCategory)
            // spinner.hide();
        }
    })
}

var cartTbl;
var bindTableToData = function (response) {
    debugger;
    // let {
    //     items
    // } = response.data;
    console.log(response)
    // console.log(response.items)
    // console.log(items)
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