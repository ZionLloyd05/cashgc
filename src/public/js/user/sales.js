$(document).ready(function () {

    var csrfToken = $('#_csrf').val();

    var postedCodes = [];
    var postedCodeIds = [];

    $(document).on('click', '#verify', function (e) {
        e.preventDefault();
        let btn = $(this);
        btn.addClass("kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--primary");
        var input = btn.closest("#wrapper").children("#code");
        var span = btn.closest("#wrapper").parent().find("#infoSpan");
        var code = input.val();
        var totalPriceSpan = $("#totalPrice2");

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
                    if (postedCodes.includes(code)) {
                        btn.text("Invalid");
                        span.text("Code already included!");
                        span.show()
                    } else {
                        btn.text("Valid");
                        span.hide();
                        var price = Number(res.data.giftCodeCategory.buyingPrice);

                        var removeBtn = btn.siblings();
                        removeBtn.attr("data-code-pr", res.data.giftCodeCategory.buyingPrice)
                        removeBtn.attr("data-code-id", res.data.id);

                        var currentPrice = Number(totalPriceSpan.attr("data-pr2"))
                        var totalPrice2 = currentPrice + price;
                        totalPriceSpan.attr("data-pr2", totalPrice2);
                        totalPriceSpan.text(totalPrice2.toLocaleString());
                        input.attr("data-status", "dirty")
                        postedCodes.push(code);
                        postedCodeIds.push(res.data.id)
                    }
                }
                console.log(postedCodes)
                console.log(postedCodeIds)
            }
        })
    })

    $(document).on('click', '#remove', function () {
        var btn = $(this);

        var totalPriceSpan = $("#totalPrice2");
        var input = btn.closest("#wrapper").children("#code");
        var code = input.val();
        var codePrice = Number(btn.attr("data-code-pr"));
        var codeId = btn.attr("data-code-id");
        var currentPrice = Number(totalPriceSpan.attr("data-pr2"));
        var totalPrice2 = currentPrice - codePrice;

        totalPriceSpan.attr("data-pr2", totalPrice2);
        totalPriceSpan.text(totalPrice2.toLocaleString());

        if (input.attr("data-status") === "dirty") {
            postedCodes.pop(code)
            postedCodeIds.pop(codeId);
        }

        console.log(postedCodes)
        console.log(postedCodeIds)

        var parent = $(this).closest("#inputBody");
        parent.remove();

    })

    $(document).on('click', '#addMore', function (e) {
        e.stopPropagation();
        var template = `
            <div id="inputBody" class="form-group">
                <div id="wrapper" class="input-group">
                    <input type="text" id="code" name="code" data-status="saint" class="form-control" placeholder="Enter Gift Code">
                    <div class="input-group-append">
                    <button class="btn btn-secondary" id="verify" type="button"><i
                    class="fa fa-plus"></i></button>
                    <button class="btn btn-secondary" data-code-pr="" id="remove" type="button"><i
                    class="fa fa-times"></i></button>
                </div>
                </div>
                <span id="infoSpan" class="form-text text-muted" style="display:none;"></span>
            </div>
        `
        var inputBody = $("#body");
        inputBody.append(template);
    })

    $('#proceedBtn').click(function () {
        var paymentOption = $("input[name='m_option_1']:checked").val();
        console.log(paymentOption)
        if (paymentOption == "bitcoin") {

            var codesToPost = postedCodeIds;

            let transactionPayload = {
                status: 2,
                type: 1,
                payment: 2,
                gcodes: codesToPost
            }

            fetch('/user/transaction', {
                    method: "POST",
                    body: JSON.stringify(transactionPayload),
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": csrfToken
                    }
                }).then(res => res.json())
                .then(data => {
                    console.log(data)
                })

        } else if (paymentOption == "bank") {
            console.log("bank")
        }
    })
})