'use strict'
$(document).ready(function () {
    loadBanks()
    generateCaptcha()
    loadWalletInfo();
})

var generateCaptcha = function () {
    let num11 = document.getElementById('num11')
    let num12 = document.getElementById('num12')

    let rand11 = Math.floor(Math.random() * 100) + 1;
    let rand12 = Math.floor(Math.random() * 100) + 1;

    num11.setAttribute('value', rand11)
    num12.setAttribute('value', rand12)
}

var updateInfoForm = $('#updateInfoForm');
updateInfoForm.validate({
    rules: {
        firstname: {
            required: true,
            minlength: 2
        },
        lastname: {
            required: true,
            minlength: 2
        },
        email: {
            required: true,
            email: true
        },
        phone: {
            required: true,
            digits: true
        },
        total1: {
            isTotal: true
        }
    },
    messages: {
        firstname: {
            required: "Firstname is required",
            minlength: "Firstname cannot be less than 2"
        },
        lastname: {
            required: "Lastname is required",
            minlength: "Lastname cannot be less than 2"
        },
        email: {
            required: "Email is required",
            email: "Invalid Email"
        },
        telephone: {
            required: "Phone number is required",
            digits: "Phone must be digits"
        }
    }
});

jQuery.validator.addMethod("isTotal", function (value) {
    var num1 = Number($('#num11').val());
    var num2 = Number($('#num12').val());
    return num1 + num2 === Number(value);
}, "Captcha failed")

$('#updateInfoForm').submit(function (e) {
    e.preventDefault();
    var csrfToken = $('#_csrf').val();
    var btn = $('#updateBtn');


    if (updateInfoForm.valid()) {

        btn.addClass('kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--brand');

        var fname = $('#firstname').val();
        var lname = $('#lastname').val();
        var email = $('#email').val();
        var phone = $('#phone').val();
        var country = $('#country').val();
        var id = $('#author').val();

        var payload = {
            fname,
            lname,
            email,
            phone,
            country,
            id
        }

        $.ajax({
            url: "/user/account",
            method: "POST",
            dataType: "json",
            data: payload,
            headers: {
                "X-CSRF-TOKEN": csrfToken
            },
            success: function (response) {
                btn.removeClass('kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--brand');
                window.location.reload();
            }
        })
    }
})

var loadBanks = function () {
    $.ajax({
        url: '/user/banks',
        method: "GET",
        dataType: "json",
        header: {
            "X-CSRF-TOKEN": csrfToken
        },
        success: function (response) {
            bindDataToSelect(response.data)
            loadBankInfo();
        }
    })
}

var bindDataToSelect = function (banks) {
    var bankSelect = $('#bankname');
    banks.forEach(bank => {
        bankSelect.append(
            `
                <option value="${bank.name}">${bank.name}</option>
            `
        )
    });
}

var bankAccountForm = $('#bankAccountFrm');

bankAccountForm.validate({
    rules: {
        bankname: {
            required: true
        },
        accnumber: {
            required: true,
            maxlength: 11
        }
    },
    messages: {
        bankname: {
            required: "Bank name is required"
        },
        accnumber: {
            required: "Account number is required"
        }
    }
})

$('#bankAccountFrm').submit(function (e) {
    e.preventDefault();
    var csrfToken = $('#_csrf').val();
    var btn = $('#saveaccBtn');

    if (bankAccountForm.valid()) {

        btn.addClass('kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--brand');

        var bkname = $('#bankname').val();
        var bknumber = $('#accnumber').val();
        var bkid = $('#bkid').val();

        var payload = {
            id: bkid,
            name: bkname,
            number: bknumber
        }

        $.ajax({
            url: "/user/bkaccount",
            method: "POST",
            dataType: "json",
            data: payload,
            headers: {
                "X-CSRF-TOKEN": csrfToken
            },
            success: function (response) {
                btn.removeClass('kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--brand');
                window.location.reload();
            }
        })
    }
})

var loadBankInfo = function () {
    $.ajax({
        url: "/user/bkaccount",
        method: "GET",
        dataType: "json",
        headers: {
            "X-CSRF-TOKEN": csrfToken
        },
        success: function (res) {
            if (res.data && res.data != null) {
                $('#bankname').val(res.data.name);
                $('#accnumber').val(res.data.number);
                $('#bkid').val(res.data.id);
            }
        }
    })
}

var walletFrm = $('#walletFrm');

walletFrm.validate({
    rules: {
        wallet: {
            required: true
        }
    },
    messages: {
        wallet: {
            required: "Wallet Id is required"
        }
    }
})

$('#walletFrm').submit(function (e) {
    e.preventDefault();
    var csrfToken = $('#_csrf').val();
    var btn = $('#saveWalletBtn');

    if (walletFrm.valid()) {
        btn.addClass('kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--brand');

        var wid = $('#wallet').val()
        var id = $('#w_id').val()

        var payload = {
            id,
            wid
        }


        $.ajax({
            url: "/user/wallet",
            method: "POST",
            dataType: "json",
            data: payload,
            headers: {
                "X-CSRF-TOKEN": csrfToken
            },
            success: function (response) {
                btn.removeClass('kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--brand');
                window.location.reload();
            }
        })
    }
})


var loadWalletInfo = function () {
    $.ajax({
        url: "/user/wallet",
        method: "GET",
        dataType: "json",
        headers: {
            "X-CSRF-TOKEN": csrfToken
        },
        success: function (res) {
            if (res.data && res.data != null) {
                $('#wallet').val(res.data.wid);
                $('#w_id').val(res.data.id);
            }
        }
    })
}