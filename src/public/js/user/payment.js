$(document).ready(function () {
    var paymentStatus = $("#paymentStatus").val()
    var tid = $("#tid").val()
    var pid = $("#pid").val()

    if (paymentStatus === "true") {
        swal('Payment Successful', '', 'success')
            .then(val => {
                loadCodeTable(tid);
            })
    }
    else if(paymentStatus === "false") {
        swal('Payment Failed', '', 'error')
            .then(val => {
                window.location.href = "/user/store";
            })
    }
})

var csrfToken = $('#_csrf').val();
var spinner = $("#spinner");
var headTitle = $('#head_title');

var loadCodeTable = function (tid) {
    spinner.show();
    headTitle.text("Generating your gift codes..")
    $.ajax({
        url: `/user/transaction?tid=${tid}`,
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
    console.log(obj)
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
                        <button class="btn btn-primary btnCopy" type="button" id="btnCopy">Copy</button>
                    </div>
                </div>
                `
            }
        }, {
            data: "date",
            render: function (date, type, row, meta) {
                return moment(date).format('LLL');
            }
        }]
    })
    spinner.hide();
    headTitle.text("Gift Codes")
}

document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btnCopy')) {
        var btn = e.target;
        var input = btn.parentNode.parentNode.children[0];
        var inpId = input.getAttribute('id');

        var copyText = document.getElementById(inpId);
        copyText.select();
        document.execCommand("copy");
        $("#kt_toast_1").toast("show");
    }
}, false);