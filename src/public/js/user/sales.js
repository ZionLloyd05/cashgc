$(document).ready(function () {
    var csrfToken = $('#_csrf').val();

    $(document).on('click', '#verify', function () {
        let btn = $(this);
        btn.addClass("kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--primary");
        var input = btn.closest("#wrapper").children("#code");
        var span = btn.closest("#wrapper").parent().find("#infoSpan");
        var code = input.val();
        var totalPriceSpan = $("#totalPrice");

        $.ajax({
            url: "/user/verify/" + code,
            method: "GET",
            dataType: "json",
            headers: {
                "X-CSRF-TOKEN": csrfToken
            },
            success: function (res) {
                btn.removeClass("kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--primary");

                if (res.status == "invalid") {
                    span.text("The gift code is invalid");
                    span.show()
                } else if (res.status == "used") {
                    btn.text("Used");
                    span.text("The gift code has been used");
                    span.show()
                } else if (res.status == "valid") {
                    btn.text("Valid");
                    span.hide();
                    var price = Number(res.data.giftCodeCategory.buyingPrice);
                    var currentPrice = Number(totalPriceSpan.attr("data-pr"))
                    var totalPrice = currentPrice + price;
                    totalPriceSpan.attr("data-pr", totalPrice);
                    totalPriceSpan.text(totalPrice.toLocaleString());
                }
                console.log(res)
            }
        })
    })

    $(document).on('click', '#remove', function () {
        var parent = $(this).closest("#inputBody");
        parent.remove();
    })

    $(document).on('click', '#addMore', function (e) {
        e.stopPropagation();
        var template = `
            <div id="inputBody" class="form-group">
                <div id="wrapper" class="input-group">
                    <input type="text" id="code" class="form-control" placeholder="Enter Gift Code">
                    <div class="input-group-append">
                    <button class="btn btn-secondary" id="verify" type="button">Verify</button>
                    <button class="btn btn-secondary" id="remove" type="button">X</button>
                </div>
                </div>
                <span id="infoSpan" class="form-text text-muted" style="display:none;"></span>
            </div>
        `
        var inputBody = $("#body");
        inputBody.append(template);
    })
})