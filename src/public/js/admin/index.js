$(document).ready(function () {

    var csrfToken = $('#_csrf').val();

    var rate = document.getElementById('rate')
    var user = document.getElementById('user')
    var code = document.getElementById('codes')
    var order = document.getElementById('pending')

    $.ajax({
        url: "/admin/analytics",
        method: "GET",
        dataType: "json",
        headers: {
            "X-CSRF-TOKEN": csrfToken
        },
        success: function (response) {
            rate.textContent = response.data[3].localrate;
            user.textContent = response.data[0];
            code.textContent = response.data[2];
            order.textContent = response.data[1];
        }
    })
})