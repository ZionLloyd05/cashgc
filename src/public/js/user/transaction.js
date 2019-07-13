"use strict"
$(document).ready(function () {
    loadTransactionTable();
})

var csrfToken = $('#_csrf').val();
var spinner = $('#spinner');

var loadTransactionTable = function () {
    spinner.show();
    $.ajax({
        url: "/user/transaction",
        method: "GET",
        dataType: "json",
        headers: {
            "X-CSRF-TOKEN": csrfToken
        },
        success: function (response) {
            bindTableToData(response);
        }
    })
}

var transactionTbl;
var bindTableToData = function (response) {
    transactionTbl = $("#transactionTbl").DataTable({
        aaData: response.data,
        aoColumns: [{
            data: "id",
            render: function (id, type, row, meta) {
                return meta.row + 1;
            }
        }, {
            data: "reference"
        }, {
            data: "type",
            render: function (type) {
                if(type == 0){
                    return "Sales"
                }
                else if(type == 1){
                    return "Buy"
                }
            }
        }, {
            data: "status",
            render: function (status, type, row, meta) {
                if(status == 0){
                    return "<span class='kt-badge kt-badge--success kt-badge--inline'>Success</span>"
                }
                else if(status == 1){
                    return "<span class='kt-badge kt-badge--danger kt-badge--inline'>Failed</span>"
                }
                else if(status == 2){
                    return "<span class='kt-badge kt-badge--warning kt-badge--inline'>Pending</span>"
                }
            }
        }, {
            data: "payment",
            render: function (payment) {
                if(payment == 0){
                    return "Paypal"
                }
                else if(payment == 1){
                    return "Paystack"
                }
                else if(payment == 2){
                    return "Bitcoin"
                }
            }
        }, {
            data: "id",
            render: function (id, type, row, meta) {
                if(row.payment == 2){
                    return `
                        <span style="overflow: visible; position: relative; width: 110px;">
                            <a id="approve" data-id=${id}
                            title="Approve Transaction" style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md"><i id="edit" class="la la-check-square"></i></a>
                            <a title="Decline" style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md"><i class="la la-ban"></i></a>
                            <a title="Decline" style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md"><i class="la la-eye"></i></a>
                        </span>
                    `
                }
                else{
                    return `
                    <span style="overflow: visible; position: relative; width: 110px;">
                         <a title="Decline" style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md"><i class="la la-eye"></i></a>
                    </span>
                    `
                }
            }
        }]
    })
    spinner.hide();
}