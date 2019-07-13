"use strict"
$(document).ready(function () {
    loadTransactionTable();
    // $("#kt_toast_1").toast({
    //     delay: 10e3
    // })
})

var csrfToken = $('#_csrf').val();
var spinner = $('#spinner');

var loadTransactionTable = function () {
    spinner.show();
    $.ajax({
        url: "/admin/transactions",
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
            render: function (user, type, row, meta) {
                if(row.user && row.user.firstname && row.user.lastname)
                    return `${row.user.firstname} ${row.user.lastname}`
            }
        }, {
            data: "id",
            render: function (id, type, row, meta) {
                if(row.payment == 2){
                    return `
                        <span style="overflow: visible; position: relative; width: 110px;">
                            <a id="approve" data-id=${id}
                            title="Approve Transaction" data-tid=${id} style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md"><i id="edit" class="la la-check-square"></i></a>
                            <a title="Decline" style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md"><i class="la la-ban"></i></a>
                            <a data-userid=${row.user.id} title="View User Wallet" style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md" id="viewWallet"><i class="la la-eye"></i></a>
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

$(document).on('click', '#viewWallet', function (e) {
    e.preventDefault();
    var userId = $(this).attr('data-userid')
    console.log(userId)

    $.ajax({
        url: `/admin/wallet/${userId}`,
        method: "GET",
        dataType: "json",
        headers: {
            "X-CSRF-TOKEN": csrfToken
        },
        success: function (response) {
            displayUserWallet(response.data)
        }
    })

})

$(document).on('click', '#approve', function (e) {
    var transactId = $(this).attr("data-tid")

    $.ajax({
        url: `/admin/transactions/?tid=${transactId}&operation=approve`,
        method: "POST",
        dataType: "json",
        headers: {
            "X-CSRF-TOKEN": csrfToken
        },
        success: function (response) {
            console.log(response)
        }
    })
})

document.addEventListener('click', function (e) {
    if ( e.target.classList.contains( 'btnCopy' ) ) {
        var btn = e.target;
        var input = btn.parentNode.parentNode.children[0];
        var inpId = input.getAttribute('id');
        
        var copyText = document.getElementById(inpId);
        copyText.select();
        document.execCommand("copy");
    }
}, false);

function displayUserWallet(data){
    if(data[0]){
        $("#modalBody").append( `
            <div class="input-group input-group-sm">
                <input type="text" class="form-control" value="${data[0].wid}" id="id_${data[0].id}" readonly>
                <div class="input-group-append">
                    <button class="btn btn-primary btnCopy" type="button" id="btnCopy">Copy</button>
                </div>
            </div>
        `)
    }else{
        $("#modalBody").append( `
        <p>User has no wallet ID!</p>
    `)
    }
    $("#walletModal").modal("show");
}

