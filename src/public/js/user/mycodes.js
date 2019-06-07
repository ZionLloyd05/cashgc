"use strict"
$(document).ready(function () {
    loadCodeTable();
})

var csrfToken = $('#_csrf').val();
var spinner = $("#spinner");

// var loadCodeTable = function () {
//     spinner.show();
//     $.ajax({
//         url: "/user/transaction",
//         method: "GET",
//         dataType: "json",
//         header: {
//             "X-CSRF-TOKEN": csrfToken
//         },
//         success: function (response) {
//             let gcodes = response.data[0].giftCodes;
//             bindTableToData(gcodes);
//         }
//     })
// }

// var codeTbl;
// var bindTableToData = function (response) {
//     codeTbl = ("#codeTbl").DataTable({
//         aaData: response,
//         aoColumns: [{
//             id: "id",
//              render: function (id, type, row, meta) {
//                 return meta.row + 1;
//             },
//         }]
//     })
// }