"use strict";
$(document).ready(function () {
    loadPayoutTable();
})

var csrfToken = $('#_csrf').val();
var spinner = $('#spinner');

var loadPayoutTable = function () {
    $.ajax({
        url: "/admin/payoutvendor",
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
            data: "category",
            render: function (category, type, row, meta) {
                if (category == "Manual") {
                    return "<span style='cursor:pointer' class='kt-badge kt-badge--primary kt-badge--inline kt-badge--pill'>Manual</span>"
                } else {
                    return "<span style='cursor:pointer' class='kt-badge kt-badge--dark kt-badge--inline kt-badge--pill'>Auto</span>"
                }
            }
        }, {
            data: "isAvailable",
            render: function (isAvailable, type, row, meta) {
                if (isAvailable) {
                    return "<span style='cursor:pointer' class='kt-badge kt-badge--primary kt-badge--inline kt-badge--pill'>Available</span>"
                } else {
                    return "<span style='cursor:pointer' class='kt-badge  kt-badge--danger kt-badge--inline  kt-badge--pill'>Not Available</span>"
                }
            }
        }, {
            data: "id",
            render: function (id, type, row, meta) {
                return `
                    <span style="overflow: visible; position: relative; width: 110px;">
                        <a id="edit" data-name=${row.name} data-slug=${row.slug} data-category=${row.category} data-state=${row.isAvailable} data-idx=${meta.row} data-id=${id} data-status=${row.isAvailable} 
                        title="Edit details" style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md"><i id="edit" class="la la-edit"></i></a>
                        <a title="Delete" data-idx=${meta.row} data-id=${id} id="delete" style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md"><i class="la la-trash"></i></a>
                    </span>
                `
            }
        }]
    });
    spinner.hide();
}

$(document).on('click', '#delete', function () {

    var rwId = $(this).attr("data-id");
    var rwIdx = $(this).attr("data-idx")

    fetch(`/admin/payoutvendor?id=${rwId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken
            }
        })
        .then(res => res.json())
        .then(response => {
            swal("Payout Vendor deleted successfully", "", "success")
                // debugger;
            let table = $('#vendorTbl').DataTable();
            table.row(rwIdx).remove().draw();
        })
})


$("#save").click(function (e) {
    let btnSpinner = $("#btnSpinner");
    btnSpinner.show();

    e.preventDefault();

    var category = $('input[name=pvendor]:checked').val();
    var isAvailable = $('input[name=isAvailable]:checked').val();
    
    if (isAvailable == "true") isAvailable = true
    else isAvailable = false;
    
    var name = $('#name').val();
    var id = $('#id').val();
    if(id == "null") id = null


    var payload = {
    	id,
        name,
        category,
        isAvailable
    }

    console.log(payload);

    fetch('/admin/payoutvendor', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken
            }
        }).then(res => res.json())
        .then(response => {
            if (response.status == "create") {
                let data = response.data;

                // CREATE NEW ROW
                var table = $('#vendorTbl').DataTable()
                table.row.add({
                    "id": data.id,
                    "name": data.name,
                    "slug": data.slug,
                    "category": data.category,
                    "isAvailable": data.isAvailable,
                }).draw();

                btnSpinner.hide();
                swal('Payout Vendor Created', '', 'success')
                    .then(val => {
                        clearInputs();
                    })

            } else if (response.status == "update") {
                let data = response.data;

                var rwIdx = $(this).attr("data-idx");

                var table = $('#vendorTbl').DataTable()
                var tempData = vendorTbl.row(parseInt(rwIdx))

                var currentRow = table.row(rwIdx).node()
                table.cell(currentRow, 0).data(rwIdx + 1)

                tempData["id"] = data.id;
                tempData["name"] = data.name;
                tempData["slug"] = data.slug;
                tempData["category"] = data.category;
                tempData["isAvailable"] = data.isAvailable;

                table.row(parseInt(rwIdx)).data(tempData) //this is to update the data in the row cells
                var currentRow = table.row(rwIdx).node()
                table.cell(currentRow, 0).data(rwIdx + 1) //this is to set the S/N field
                table.draw(false)

                swal('Code Category Modified', '', 'success');
            }

            btnSpinner.hide();
        })
})
function clearInputs() {
    $('#name').val("");
    $("#id").val("null");
    $('#payoutvendorModal').modal('hide');
}

$(document).on("click", "#edit", function (e) {
    e.stopPropagation()
    var edit = $(this);
    var editBtn;

    var tgname = edit.prop("tagName");
    if (tgname == "I") {
        editBtn = edit.parent();
    } else if (tgname == "A") {
        editBtn = edit;
    }

    console.log(editBtn)
    console.log(editBtn.attr)

    // assign attrribute to modal controls
    var idx = editBtn.attr("data-idx");
    $("#save").attr("data-idx", idx);

    var id = editBtn.attr('data-id');
    $('#id').val(id);

    var name = editBtn.attr('data-name');
    $('#name').val(name);

    var isAvailable = editBtn.attr("data-state");
    console.log(isAvailable);
    if (isAvailable == "true") {
        $("#isavailable").prop("checked", true);
    } else {
        $("#isnotavailable").prop("checked", true);
    }

    var cateogry = editBtn.attr("data-category");
    if (cateogry == "Auto") {
        $("#auto").prop("checked", true);
    } else {
        $("#manual").prop("checked", true);
    }

    
    $("#payoutvendorModalLabel").text("Edit Code Category");
    $("#payoutvendorModal").modal("show");    
})

$("#modalClose").on('click', function () {
    clearInputs();
});
