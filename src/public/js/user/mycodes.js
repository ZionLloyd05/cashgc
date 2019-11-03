"use strict"
$(document).ready(function () {
    loadCodeTable();
    $("#kt_toast_1").toast({
        delay: 4e3
    })
})

var csrfToken = $('#_csrf').val();
var spinner = $("#spinner");

var loadCodeTable = function () {

    $.ajax({
        url: "/user/transaction",
        method: "GET",
        dataType: "json",
        header: {
            "X-CSRF-TOKEN": csrfToken
        },
        success: function (response) {
            var data = response.data;
            var formattedData = formatData(data);
            bindTableToData(formattedData);
        }
    })
}

var formatData = function (data) {
    var obj = []

    data.forEach(transaction => {
        var transactType = "";
        (transaction.type == 0) ? transactType = "Purchase": transactType = "Sales";
        transaction.giftCodes.forEach(code => {
            var payload = {
                title: code.giftCodeCategory.title,
                code: code.code,
                date: code.createdAt,
                status: (code.isUsed == true) ? "Used" : "Not Used",
                type: transactType
            }
            obj.push(payload)
        })
    })
    // console.log(obj)
    return obj
}

var codeTbl;
var bindTableToData = function (response) {
    codeTbl = $("#codeTbl").DataTable({
        aaData: response,
        aoColumns: [{
            data: "id",
            render: function (id, type, row, meta) {
                return meta.row + 1;
            },
        }, {
            data: "title"
        }, {
            data: "code",
            render: function (code, type, row, meta) {
                return `
                <div class="input-group input-group-sm">
                    <input type="text" class="form-control" value="${code}" id="id_${meta.row}" readonly>
                    <div class="input-group-append">
                        <button data-clipboard-text="${code}" class="btn btn-primary btnCopy" type="button">Copy</button>
                    </div>
                </div>
                `
            }
        }, {
            data: "isActivated",
            render: function (isActivated) {
                if (isActivated == "true")
                    return `<span class="kt-badge  kt-badge--primary kt-badge--inline kt-badge--pill">Activate</span>`
                else
                    return `<span class="kt-badge  kt-badge--danger kt-badge--inline kt-badge--pill">Inactive</span>`
            }
        }, {
            data: "date",
            render: function (date, type, row, meta) {
                return moment(date).format('LLL');
            }
        }, {
            data: "status",
            render: function (data, type, row, meta) {
                if (data == "Used")
                    return `<span class="kt-badge  kt-badge--danger kt-badge--inline kt-badge--pill">${data}</span>`
                else
                    return `<span class="kt-badge  kt-badge--primary kt-badge--inline kt-badge--pill">${data}</span>`
            },
        }, {
            data: "type"
        }]
    })
    spinner.hide();
}


var clipboard = new ClipboardJS('.btnCopy');

clipboard.on('success', function (e) {
    swal("Code Copied", "", "success");
    e.clearSelection();
});

clipboard.on('error', function (e) {
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);
});