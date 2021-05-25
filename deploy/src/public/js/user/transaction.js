"use strict"
$(document).ready(function () {
    loadTransactionTable();
    // onlineCheck().then((res) => {
    //     })
    //     .catch(err => {
    //         swal("You're not connected", "Click ok to reload the page", "error")
    //             .then(val => {
    //                 window.location.reload();
    //             })
    //     })
})


var csrfToken = $('#_csrf').val();
var spinner = $('#spinner');

// var onlineCheck = function () {
//     const proxyURL = "https://cors-anywhere.herokuapp.com/";
//     const requestURL = "https://res.cloudinary.com/zionlloyd/image/upload/v1566997408/Date.png";
//     let xhr = new XMLHttpRequest();
//     return new Promise((resolve, reject) => {
//         xhr.onload = () => {
//             // Set online status
//             resolve(true);
//         };
//         xhr.onerror = () => {
//             // Set online status
//             reject(false);
//         };

//         xhr.open('GET', proxyURL + requestURL, true);
//         xhr.setRequestHeader('cache-control', 'no-cache, must-revalidate, post-check=0, pre-check=0');
//         xhr.setRequestHeader('cache-control', 'max-age=0');
//         xhr.setRequestHeader('expires', '0');
//         xhr.setRequestHeader('expires', 'Tue, 01 Jan 1980 1:00:00 GMT');
//         xhr.setRequestHeader('pragma', 'no-cache');
//         xhr.send();
//     });
// }

var loadTransactionTable = function () {
    spinner.show();
    $.ajax({
        url: "/user/utransaction",
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
                    if (type == 0) {
                        return "Purchase"
                    } else if (type == 1) {
                        return "Sales"
                    }
                }
            }, {
                data: "status",
                render: function (status, type, row, meta) {
                    if (status == 0) {
                        return "<span class='kt-badge kt-badge--success kt-badge--inline'>Processed</span>"
                    } else if (status == 1) {
                        return "<span class='kt-badge kt-badge--danger kt-badge--inline'>Failed</span>"
                    } else if (status == 2) {
                        return "<span class='kt-badge kt-badge--warning kt-badge--inline'>Pending</span>"
                    }
                }
            }, {
                data: "payment",
                render: function (payment) {
                    if (payment == 0) {
                        return "Paypal"
                    } else if (payment == 1) {
                        return "Auto Payout"
                    } else if (payment == 2) {
                        return "Bitcoin"
                    } else if (payment == 3) {
                        return "Bank"
                    } else if (payment == 4) {
                        return "Manual Payout"
                    }
                }
            }, {
                data: "amount",
                render: function (amount) {
                    return amount.toLocaleString()
                }
            }

        ]
    })
    spinner.hide();
}