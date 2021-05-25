"use strict";
$("#signin").validate({
    rules: {
        email: {
            required: true,
            email: true
        },
        password: {
            required: true
        }
    },
    messages: {
        email: {
            required: "Email is required",
            email: "Invalid email"
        },
        password: {
            required: "Password is required"
        }
    }
});