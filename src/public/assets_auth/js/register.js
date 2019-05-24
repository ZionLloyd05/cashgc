"use strict";
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
            email: true
        },
        phone: {
            required: true,
            digits: true,
            maxlength: 12
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
            email: "Invalid Email"
        },
        phone: {
            required: "Phone number is required",
            digits: "Phone must be digits",
            maxlength: "Invalid Phone number"
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