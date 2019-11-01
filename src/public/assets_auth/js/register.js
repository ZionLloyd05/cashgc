"use strict";
$(document).ready(function () {
    $('#phoneCode').on('change', function () {
        var code = $(this).val();
        var country = $('option:selected', this).attr('data-countryCode');
        $.ajax({
            url: "https://restcountries.eu/rest/v2/callingcode/" + code,
            method: "GET",
            dataType: "json",
            success: function (data) {
                if (code == 1) {
                    if (country == "US") {
                        $('#country').val(data[1].name);
                        return;
                    }
                }
                $('#country').val(data[0].name);
            }
        })
    })
})
$("#signup").validate({
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
            email: true,
            remote: {
                url: `/user/isemailexist`,
                type: "post"
            }
        },
        phone: {
            required: true,
            digits: true,
            maxlength: 12,
            remote: {
                url: '/user/isphoneexist',
                type: "post"
            }
        },
        password: {
            required: true,
            minlength: 5
        },
        confirm_password: {
            required: true,
            equalTo: "#password"
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
            email: "Invalid Email",
            remote: "Email has already been taken"
        },
        phone: {
            required: "Phone number is required",
            digits: "Phone must be digits",
            remote: "Phone number has been taken"
        },
        password: {
            required: "Password is required",
            minlength: "Password cannot be less than 5"
        },
        confirm_password: {
            required: "",
            equalTo: "Password does not match"
        }
    }
});