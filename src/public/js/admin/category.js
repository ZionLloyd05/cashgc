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

var categoryTbl;
var bindTableToData = function (response) {
    // console.log(response);
    categoryTbl = $("#categoryTbl").DataTable({
        aaData: response.data,
        aoColumns: [{
            data: "id",
            render: function (id, type, row, meta) {
                return meta.row + 1;
            }
        }, {
            data: "title",
            render: function (title, type, row, meta) {
                return title + " GC";
            }
        }, {
            data: "prefix"
        }, {
            data: "sellingPrice"
        }, {
            data: "buyingPrice"
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
            data: "imageUrl",
            render: function (imageUrl, type, row, meta) {
                return "<a href=" + imageUrl + " target='_blank' class='kt-font-bold kt-font-primary'>View Image</a>"
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

// Validating create form
var form = $("#categoryFrm");
form.validate();


$("#save").click(function (e) {
    let btnSpinner = $("#btnSpinner");

    e.preventDefault();
    if (form.valid()) {
        btnSpinner.show()

        let catFrm = document.getElementById("categoryFrm");
        let formData = new FormData(catFrm)

        fetch('/admin/category', {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRF-TOKEN": csrfToken
                }
            })
            .then(res => res.json())
            .then(response => {
                if (response.status == "created") {
                    let data = response.data

                    // CREATE NEW ROW
                    var table = $('#categoryTbl').DataTable()
                    table.row.add({
                        "id": data.id,
                        "title": data.title,
                        "prefix": data.prefix,
                        "sellingPrice": data.sellingPrice,
                        "buyingPrice": data.buyingPrice,
                        "sellingPrice": data.sellingPrice,
                        "isAvailable": data.isAvailable,
                        "imageUrl": data.image
                    }).draw();

                    $("#toastTitle").text("Code Category Created");
                    $("#toastBody").text("The code category was successfully created.");

                } else if (response.status == "updated") {
                    let data = response.data;

                    var rwIdx = $(this).attr("data-idx");

                    var table = $('#categoryTbl').DataTable()
                    var tempData = categoryTbl.row(parseInt(rwIdx))

                    var currentRow = table.row(rwIdx).node()
                    table.cell(currentRow, 0).data(rwIdx + 1)

                    tempData["id"] = data.id;
                    tempData["title"] = data.title;
                    tempData["prefix"] = data.prefix;
                    tempData["sellingPrice"] = data.sellingPrice;
                    tempData["buyingPrice"] = data.buyingPrice;
                    tempData["sellingPrice"] = data.sellingPrice;
                    tempData["isAvailable"] = data.isAvailable;
                    tempData["imageUrl"] = data.imageUrl;

                    table.row(parseInt(rwIdx)).data(tempData) //this is to update the data in the row cells
                    var currentRow = table.row(rwIdx).node()
                    table.cell(currentRow, 0).data(rwIdx + 1) //this is to set the S/N field
                    table.draw(false)

                    $("#toastTitle").text("Code Category Modified");
                    $("#toastBody").text("Code category was successfully updated.");
                }

                $("#kt_toast_1").toast("show");
                console.log(response)
                btnSpinner.hide();
                clearInputs();
            })
            .catch(err => {
                console.log(err)
                btnSpinner.hide();
            })
    }
})

// edit and delete
// edit first
$(document).on("click", "#edit", function (e) {
    e.stopPropagation();
    var edit = $(this);
    var editBtn;

    var tgname = edit.prop("tagName");
    if (tgname == "I") {
        editBtn = edit.parent();
    } else if (tgname == "A") {
        editBtn = edit;
    }

    // assign attrribute to modal controls
    var idx = editBtn.attr("data-idx");
    $("#save").attr("data-idx", idx);

    var title = editBtn.attr("data-title");
    $("#title").val(title)

    var prefix = editBtn.attr("data-prefix");
    $("#prefix").val(prefix);

    var sp = editBtn.attr("data-sp");
    $("#sp").val(sp);

    var bp = editBtn.attr("data-bp");
    $("#bp").val(bp);

    var id = editBtn.attr("data-id");
    $("#id").val(id);

    var isAvailable = editBtn.attr("data-av");
    console.log(isAvailable);
    if (isAvailable == "true") {
        $("#isavailable").prop("checked", true);
    } else {
        $("#isnotavailable").prop("checked", true);
    }

    $("#categoryModalLabel").text("Edit Code Category");
    $("#categoryModal").modal("show");
})

$("#modalClose").on('click', function () {
    clearInputs();
});

function clearInputs() {
    $("#title").val("");
    $("#prefix").val("");
    $("#sp").val("");
    $("#bp").val("");
    $("#id").val("");

    let $el = $('#image');
    $el.wrap('<form>').closest('form').get(0).reset();
    $el.unwrap();

    $("#categoryModalLabel").text("New Code Category");
}