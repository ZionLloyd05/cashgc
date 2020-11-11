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
        'columnDefs': [{
            'targets': 0,
            'checkboxes': {
                'selectRow': true
            }
        }],
        'select': {
            'style': 'single'
        },
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
            data: "isPartner",
            render: function(isPartner, type, row, meta) {
                if(row.isPartner == true){
                    return "Active"
                }else{
                    return "Inactive"
                }
            }
        }, {
            data: "createdAt",
            render: function (createdAt, type, row, meta) {
                return moment(createdAt).format('LLL');
            }
        }]
    })

    spinner.hide();
}



$('#runAction').click(function () {
    var table = $("#userTbl").DataTable();
    var data = table.rows('.selected').data();
    var userId = 0;

     data.each(cell => userId = cell.id);

     console.log(userId)
    var operation = $('#actionSelect').val()

    executeAction(userId, operation);
});


var executeAction = function (userId, operation) {

    if(userId === 0){
        console.log(csrfToken);
        console.log(operation);
        swal('Invalid request', 'No user was selected', 'error');
        return false;
    }

    var csrfToken = $('#_csrf').val();
    console.log(csrfToken);
    console.log(operation);

    $.ajax({
        url: "/admin/user/partner",
        method: "PUT",
        data: {id: userId},
        dataType: "json",
        headers: {
            "X-CSRF-TOKEN": csrfToken
        },
        success: function (response) {
            if (response.status == "success") {
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