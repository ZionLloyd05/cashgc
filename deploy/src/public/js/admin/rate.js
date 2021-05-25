"use strict";
$(document).ready(function () {
    loadRateTable();
})

var csrfToken = $('#_csrf').val();
var spinner = $('#spinner');

var loadRateTable = function () {
    $.ajax({
        url: "/admin/rate",
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

var rateTbl;
var bindTableToData = function (response) {
    // console.log(response);
    rateTbl = $("#rateTbl").DataTable({
        aaData: response.data,
        aoColumns: [{
                data: "id",
                render: function (id, type, row, meta) {
                    return meta.row + 1;
                }
            },
            {
                data: "localrate",
                render: function (localrate) {
                    return `#${localrate.toLocaleString()}`
                }
            },
            {
                data: "isactive",
                render: function (isactive) {
                    if (isactive) {
                        return "<span style='cursor:pointer' class='kt-badge kt-badge--brand kt-badge--inline kt-badge--pill'>Active</span>"
                    } else {
                        return "<span style='cursor:pointer' class='kt-badge  kt-badge--danger kt-badge--inline kt-badge--pill'>Inactive</span>"
                    }
                }
            },
            {
                data: "id",
                render: function (id, type, row, meta) {
                    return `
                        <span style="overflow: visible; position: relative; width: 110px;">
                            <a id="edit" data-idx=${meta.row} data-id=${id} data-rate=${row.localrate}  
                            title="Edit details" style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md"><i id="edit" class="la la-edit"></i></a>
                            <a title="Toggle Status" data-status=${row.isactive } data-idx=${meta.row} data-id=${id} id="status" style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md"><i class="la la-eye"></i></a>
                            <a title="Delete" data-idx=${meta.row} data-id=${id} id="delete" style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md"><i class="la la-trash"></i></a>
                        </span>
                    `
                }
            }
        ]
    });
    spinner.hide();
}

$(document).on('click', '#status', function () {
    $('#modalText').text("Toggling rate status...")
    $('#statusModal').modal("show")
    var btn = $(this)
    var rwIdx = btn.attr("data-idx")
    var rwId = btn.attr("data-id")
    var isactive = btn.attr("data-status")

    var id = Number(rwId)

    if (isactive === "true")
        isactive = true;
    else if (isactive === "false")
        isactive = false;

    var payload = {
        id,
        isactive
    };

    console.log(payload)

    fetch('/admin/rate/status', {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken
            }
        }).then(res => res.json())
        .then(response => {
            var status = response.status;
            $('#statusModal').modal("hide")
            if (status === "false") {
                swal("Unable to toggle status", response.data, "error")
            } else if (status === "true") {

                var data = response.data

                var table = $('#rateTbl').DataTable()
                var tempData = rateTbl.row(parseInt(rwIdx))

                var currentRow = table.row(rwIdx).node()
                table.cell(currentRow, 0).data(rwIdx + 1)

                tempData["id"] = data.id;
                tempData["localrate"] = data.localrate;
                tempData["isactive"] = data.isactive;

                table.row(parseInt(rwIdx)).data(tempData) //this is to update the data in the row cells
                var currentRow = table.row(rwIdx).node()
                table.cell(currentRow, 0).data(rwIdx + 1) //this is to set the S/N field
                table.draw(false)

                swal("Rate status toggled.", "", "success")
            }
        })
})

$(document).on('click', '#delete', function () {
    $('#modalText').text("Removing rate...")
    $('#statusModal').modal("show")

    var rwId = $(this).attr("data-id");
    var rwIdx = $(this).attr("data-idx")

    fetch(`/admin/rate?id=${rwId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken
            }
        })
        .then(res => res.json())
        .then(response => {
            $('#statusModal').modal("hide")
            swal("Rate deleted successfully", "", "success")

            let table = $('#rateTbl').DataTable();
            table.row(rwIdx).remove().draw();
        })
})

$('#btnSaveRate').on('click', function () {
    var btn = $(this)
    btn.attr("disabled", true)
    btn.addClass('kt-spinner kt-spinner--v2 kt-spinner--right kt-spinner--sm kt-spinner--dark')
    var rate = $('#rateInput').val();
    var id = $('#rate_id').val();

    var rate_id = Number(id)
    var rate = Number(rate)

    let payload = {
        id: rate_id,
        localrate: rate
    }

    fetch('/admin/rate', {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken
            }
        })
        .then(res => res.json())
        .then(response => {
            console.log(response)
            btn.attr("disabled", false)
            swal("Rate Saved", "", "success")
            btn.removeClass('kt-spinner kt-spinner--v2 kt-spinner--right kt-spinner--sm kt-spinner--dark')

            var data = response.data

            if (response.status == "create") {
                // Create New Row
                var table = $('#rateTbl').DataTable()
                table.row.add({
                    "id": data.id,
                    "localrate": data.localrate,
                    "isactive": data.isactive
                }).draw();
            } else if (response.status == "update") {

                var rwIdx = $(this).attr("data-idx");

                var table = $('#rateTbl').DataTable()
                var tempData = rateTbl.row(parseInt(rwIdx))

                var currentRow = table.row(rwIdx).node()
                table.cell(currentRow, 0).data(rwIdx + 1)

                tempData["id"] = data.id;
                tempData["localrate"] = data.localrate;
                tempData["isactive"] = data.isactive;

                table.row(parseInt(rwIdx)).data(tempData) //this is to update the data in the row cells
                var currentRow = table.row(rwIdx).node()
                table.cell(currentRow, 0).data(rwIdx + 1) //this is to set the S/N field
                table.draw(false)
            }
        })
})

$(document).on('click', '#edit', function () {
    var edit = $(this);
    var rwId = edit.attr("data-id")
    var rwIdx = edit.attr("data-idx")
    var rate = edit.attr("data-rate")

    $("#btnSaveRate").attr("data-idx", rwIdx)
    $("#rateTitle").text("Edit Rate");
    $("#rate_id").val(rwId);
    $("#rateInput").val(rate)

    $("#rateModal").modal("show")
})

$("#modalClose").on('click', function () {
    clearInputs();
    $("#rateModal").modal("hide")
});

function clearInputs() {
    $("#rateInput").val("");
    $("#rate_id").val("");
    $("#rateTitle").text("New Rate");
    $("#btnSaveRate").attr("data-idx", "")

    $("#categoryModalLabel").text("New Code Category");
}