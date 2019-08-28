$(document).ready(function () {
    loadUserTable();
})

var csrfToken = $('#_csrf').val();
var spinner = $("#spinner");

var loadUserTable = function () {

    $.ajax({
        url: "/admin/user",
        method: "GET",
        dataType: "json",
        header: {
            "X-CSRF-TOKEN": csrfToken
        },
        success: function (response) {
            var data = response.data;
            bindTableToData(data);
        }
    })
}

var userTbl;
var bindTableToData = function (response) {
    userTbl = $("#userTbl").DataTable({
        aaData: response,
        aoColumns: [{
            data: "id",
            render: function (id, type, row, meta) {
                return meta.row + 1;
            },
        }, {
            data: "id",
            render: function (id, type, row, meta) {
                return row.firstname + " " + row.lastname
            }
        }, {
            data: "email"
        }, {
            data: "phone"
        }, {
            data: "createdAt",
            render: function (createdAt, type, row, meta) {
                return moment(createdAt).format('LLL');
            }
        }]
    })

    spinner.hide();
}