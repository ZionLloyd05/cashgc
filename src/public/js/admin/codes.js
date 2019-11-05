"use strict"

$(document).ready(function () {
    loadCodesTable()

})

var csrfToken = $('#_csrf').val();
var spinner = $("#spinner");

var loadCodesTable = function () {

    $.ajax({
        url: "/admin/codesbytransaction",
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
            // console.log(code);
            var payload = {
                transactionref: transaction.reference,
                title: code.giftCodeCategory.title,
                code: code.code,
                date: code.createdAt,
                isActivated: code.isActivated,
                status: (code.isUsed == true) ? "Used" : "Not Used",
                type: transactType
            }
            obj.push(payload)
        })
    })
    return obj
}

var codeTbl;
var bindTableToData = function (response) {
    codeTbl = $("#codeTbl").DataTable({
        aaData: response,
        'columnDefs': [{
            'targets': 0,
            'checkboxes': {
                'selectRow': true
            }
        }],
        'select': {
            'style': 'multi'
        },
        'order': [
            [1, 'asc']
        ],
        aoColumns: [{
            data: "id",
            render: function (id, type, row, meta) {
                return `${meta.row + 1}`;
            },
        }, {
            data: "transactionref"
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
                if (isActivated == true)
                    return `<span class="kt-badge  kt-badge--primary kt-badge--inline kt-badge--pill">Active</span>`
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




$('#runAction').click(function () {
    var table = $("#codeTbl").DataTable();
    var data = table.rows('.selected').data();
    var payload = [];

    data.each(cell => payload.push(cell.code));

    var operation = $('#actionSelect').val()

    executeAction(payload, operation);
});

var executeAction = function (payload, operation) {

    var csrfToken = $('#_csrf').val();
    console.log(csrfToken);
    let PAYLOAD = {
        payload,
        operation
    }

    $.ajax({
        url: "/admin/bulkactivation",
        method: "POST",
        data: PAYLOAD,
        dataType: "json",
        headers: {
            "X-CSRF-TOKEN": csrfToken
        },
        success: function (response) {
            if (response.data.length == 0) {
                swal(`Operation Successfull`, ``, 'success')
                    .then(val => {
                        window.location.reload();
                    })
            } else {
                swal('Something went wrong', '', 'error');
            }
        }
    })
}