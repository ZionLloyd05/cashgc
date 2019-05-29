$(document).ready(function () {
    loadCodeCategories();
})

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
        categoryBuilds += `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <div class="">
                        <img class="width__100" src="${category.imageUrl}" />
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div class="col-7">
                                <h5 class="card-title">Price: $${category.sellingPrice}.00</h5>
                            </div>
                            <div class="col-5">
                                <input type="number" placeholder="Quantity" name="qty" id="qty"
                                    class="input-sm form-control">
                            </div>
                        </div>
                        <button type="button" class="btn btn-sm btn-brand pull-right">
                            <i class="flaticon-business"></i>
                            <span class="kt-hidden-mobile">Add to Cart</span>
                        </button>
                    </div>
                </div>
            </div>
        `
    })
    console.log(categoryBuilds);
    spinner.hide();
    storeBody.html(categoryBuilds);
}