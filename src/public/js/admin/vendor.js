"use strict";
$(document).ready(function () {
    loadCategoryTable();
    $("#kt_toast_1").toast({
        delay: 10e3
    })
})

var csrfToken = $('#_csrf').val();
var spinner = $('#spinner');

var loadCategoryTable = function () {
    $.ajax({
        url: "/admin/category",
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


var vendorTbl;
var bindTableToData = function (response) {
    // console.log(response);
    vendorTbl = $("#vendorTbl").DataTable({
        aaData: response.data,
        aoColumns: [{
            data: "id",
            render: function (id, type, row, meta) {
                return meta.row + 1;
            }
        }, {
            data: "name"
        }, {
            data: "slug"
        }, {
            data: "category"
        }, {
            data: "isAvailable",
            render: function (isAvailable, type, row, meta) {
                if (isAvailable) {
                    return "<span style='cursor:pointer' class='kt-badge kt-badge--brand kt-badge--inline kt-badge--pill'>Available</span>"
                } else {
                    return "<span style='cursor:pointer' class='kt-badge  kt-badge--danger kt-badge--inline kt-badge--pill'>Not Available</span>"
                }
            }
        }, {
            data: "id",
            render: function (id, type, row, meta) {
                return `
                    <span style="overflow: visible; position: relative; width: 110px;">
                        <a id="edit" data-idx=${meta.row} data-id=${id} data-title=${row.title} data-prefix=${row.prefix} data-sp=${row.sellingPrice} data-bp=${row.buyingPrice} data-av=${row.isAvailable} 
                        title="Edit details" style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md"><i id="edit" class="la la-edit"></i></a>
                        <a title="Delete" style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md"><i class="la la-trash"></i></a>
                    </span>
                `
            }
        }]
    });
    spinner.hide();
}