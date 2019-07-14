$(document).ready(function () {
    swal("Payment Successful", "Your payment was successful, click ok to generated gift code as ordered.", "success")
    .then((value) => {
        swal('generate gift codes');
    });
})