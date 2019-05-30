$(document).ready(function () {
    loadCodeCategories();

    $(document).on("click", "#addtocart", function (e) {
        e.stopPropagation();
        console.log($(this).attr("data-cid"))
    })
})
 
var cart = $("#cart_no");
var csrfToken = $('#_csrf').val();
var spinner = $('#spinner');


var loadCodeCategories = function () {
    spinner.show();
    $.ajax({
        url: "/user/category",
        method: "GET",
        dataType: "json",
        header: {
            "X-CSRF-TOKEN": csrfToken
        },
        success: function (response) {
            buildCodeCategory(response.data);
        }
    })
}

function buildCodeCategory(data = []) {
    var storeBody = $("#storeBody");
    var categoryBuilds = "";
    data.forEach(category => {
        categoryBuilds += '<div class="col-md-4 mb-4">';
        categoryBuilds += '<div class="card">';
        categoryBuilds += '<div class=""><img class="width__100" src="' + category.imageUrl + '"/></div>';
        categoryBuilds += '<div class="card-body"><div class="row mb-3">';
        categoryBuilds += '<div class="col-7"><h5 class="card-title">Price: $' + category.sellingPrice + '.00</h5></div>';
        categoryBuilds += '<div class="col-5"><input type="number" placeholder="Quantity" name="qty" id="qty" class="input-sm form-control"></div></div>';
        categoryBuilds += '<button type="button" class="btn btn-sm btn-brand pull-right" data-cid=' + category.id + ' id="addtocart">Add to Cart</button>';
        categoryBuilds += '</div></div></div>';

    })
    // console.log(categoryBuilds);
    spinner.hide();
    storeBody.html(categoryBuilds);
}