var authField;
$(document).ready(function () {
  authField = $("#authverv");
  if (authField.val() != "0123") confirmVerificationStatus();
  loadUserCartItem();
  loadVendors();
  getExchangeRate();
});

var csrfToken = $("#_csrf").val();
var spinner = $("#tblLoader");
var cartQuantitySpan = $("#cartTotalQuantity");
var cartTotalAmountSpan = $("#cartTotalAmount");
var gcHeader = $("#gcHeader");
var gcHeaderText = $("#gcHeaderText");
var clearCartBtn = $("#clearCart");

var currentCartItem = [];

var isTouched = false;
var cartResponse = "";

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

var getExchangeRate = function () {
  $.ajax({
    url: "/user/rate",
    method: "GET",
    dataType: "json",
    header: {
      "X-CSRF-TOKEN": csrfToken,
    },
    success: function (response) {
      if (response.status === "read") {
        $("#rate").val(response.data.localrate);
      }
    },
  });
};

function loadVendors() {
  $.ajax({
    url: "/user/paymentvendors",
    method: "get",
    dataType: "json",
    headers: {
      "X-CSRF-TOKEN": csrfToken,
    },
    success: function (response) {
      if (response.data != null) {
        buildVendors(response.data);
      }
    },
  });
}

function buildVendors(payload) {
  var vendors = document.getElementById("vendor_section");

  var template = "";
  payload.forEach((vendor) => {
    template += `
            <h6 class="kt-widget-13__title" href="#">${vendor.name} Payment Information</h6>
            <div class="kt-widget-21__legends">
                <div class="kt-widget-21__legend mb-2">
                    <i class="la la-bookmark"></i>
                    ${vendor.info}
                </div>
            </div>
        `;
  });

  vendors.innerHTML = template;
}

function confirmVerificationStatus() {
  $.ajax({
    url: "/user/authcheck",
    method: "get",
    dataType: "json",
    headers: {
      "X-CSRF-TOKEN": csrfToken,
    },
    success: function (response) {
      console.log(response.status);
      if (response.status != true) {
        swal(
          "Account not verified",
          "Your account has to be verified to make transactions, click ok to verify now.",
          "info"
        ).then((val) => {
          window.location = "/user/profile";
        });
      }
      authField.val("0123");
    },
  });
}

var loadUserCartItem = function () {
  spinner.show();
  $.ajax({
    url: "/user/cartitem/",
    method: "GET",
    dataType: "json",
    header: {
      "X-CSRF-TOKEN": csrfToken,
    },
    success: function (response) {
      cartResponse = response.data.items;

      cartQuantitySpan.text(response.data.totalQuantity);
      cartQuantitySpan.attr("data-qty", response.data.totalQuantity);

      cartTotalAmountSpan.text(response.data.totalPrice.toLocaleString());
      cartTotalAmountSpan.attr("data-pr", response.data.totalPrice);

      currentCartItem = response.data.items;
      bindTableToData(response.data.items);
    },
  });
};

var cartTbl;
var bindTableToData = function (response) {
  cartTbl = $("#cartTbl").DataTable({
    aaData: response,
    aoColumns: [
      {
        data: "id",
        render: function (id, type, row, meta) {
          return meta.row + 1;
        },
      },
      {
        data: "id",
        render: function (giftCodeCategory, type, row, meta) {
          return `${row.giftCodeCategory.title} gift code`;
        },
      },
      {
        data: "id",
        render: function (giftCodeCategory, type, row, meta) {
          return `${row.giftCodeCategory.sellingPrice}`;
        },
      },
      {
        data: "quantity",
      },
      {
        data: "total",
      },
      {
        data: "id",
        render: function (id, type, row, meta) {
          return `
                <i data-idx='${meta.row}' data-pr="${row.giftCodeCategory.sellingPrice}" data-gcc="${row.giftCodeCategory.id}" style="cursor:pointer" class="fa fa-minus-circle" id="minus"></i>&nbsp;
                <i data-idx='${meta.row}' data-pr="${row.giftCodeCategory.sellingPrice}" data-gcc="${row.giftCodeCategory.id}" class="fa fa-plus-circle"  style="cursor:pointer" id="add"></i>&nbsp;
            `;
        },
      },
    ],
  });
  spinner.hide();
};

$(document).on("click", "#add", function () {
  const MAX_TRANSACTION_LIMIT = 500;

  var currentQuantity = Number(cartQuantitySpan.attr("data-qty"));
  var currentTotalPrice = Number(cartTotalAmountSpan.attr("data-pr"));

  var supposedNewPrice = currentTotalPrice + Number($(this).attr("data-pr"));

  if (supposedNewPrice > MAX_TRANSACTION_LIMIT) {
    // console.log("cannot");
    swal(
      "Maximum transaction limit is $500",
      "Single transaction cannot exceed $500",
      "error"
    );
    return false;
  }

  isTouched = true;
  var gcId = $(this).attr("data-gcc");

  let payload = {
    gcId,
    qty: 1,
  };

  fetch("/user/cartitem", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": csrfToken,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      reloadCartItem();

      /**
       * Re-calculate total qty and price
       */

      var newQuantity = currentQuantity + 1;
      var newPrice = currentTotalPrice + Number($(this).attr("data-pr"));
      cartQuantitySpan.text(newQuantity);
      cartTotalAmountSpan.text(newPrice);

      cartQuantitySpan.attr("data-qty", newQuantity);
      cartTotalAmountSpan.attr("data-pr", newPrice);
      // console.log(data)

      var rwIdx = $(this).attr("data-idx");
      let table = $("#cartTbl").DataTable();
      // console.log(rwIdx)
      let tempData = cartTbl.row(parseInt(rwIdx));

      var currentRow = table.row(rwIdx).node();
      table.cell(currentRow, 0).data(rwIdx + 1);

      tempData["id"] = data.data.id;
      tempData["giftCodeCategory"] = data.data.giftCodeCategory;
      tempData["quantity"] = data.data.quantity;
      tempData["total"] = data.data.total;

      // console.log(tempData)
      table.row(parseInt(rwIdx)).data(tempData); //this is to update the data in the row cells
      var currentRow = table.row(rwIdx).node();
      table.cell(currentRow, 0).data(rwIdx + 1); //this is to set the S/N field
      table.draw(false);
    });
});

function reloadCartItem() {
  // console.log("reload cart item")
  // debugger
  fetch("/user/cartitem/", {
    method: "GET",
    headers: {
      "X-CSRF-TOKEN": csrfToken,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      currentCartItem = res.data.items;
      prepareCartInStore(res.data);
    })
    .catch((err) => console.log(err));
}

function prepareCartInStore(data) {
  let { items, totalQuantity, totalPrice } = data;

  cart.text(totalQuantity);
  let itemString = "";

  totalQuantity > 1
    ? (itemString = `${totalQuantity} cart items`)
    : (itemString = `${totalQuantity} cart item`);

  cartItemTotal.text(itemString);
  // total && total.text(totalPrice)

  let citemMarkupBundle = "";
  cartItemBody.empty();
  // console.log(items.length)
  if (items.length > 0) {
    items.forEach((item) => {
      let { giftCodeCategory } = item;
      citemMarkupBundle += `
                    <a href="#" class="kt-notification__item">
                        <div class="kt-notification__item-icon">
                            <i class="flaticon2-line-chart kt-font-success"></i>
                        </div>
                        <div class="kt-notification__item-details">
                            <div class="kt-notification__item-title">
                                ${giftCodeCategory.title} Gift Code
                            </div>
                            <div class="kt-notification__item-time">
                                2 hrs ago
                            </div>
                        </div>
                        <div class="kt-notification__item-icon">
                            + ${item.quantity}
                        </div>
                    </a>
                   
            `;
    });

    citemMarkupBundle += `
            <div class="kt-notification__item">
                <a href="/user/cart" class="btn btn-block btn-brand">
                    <i class="flaticon2-shopping-cart-1"></i>
                    <span class="kt-hidden-mobile">Checkout</span>
                </a>
            </div>
        `;
  } else {
    citemMarkupBundle = `
            <div class="kt-notification__item">
            <div class="kt-notification__item-icon">
            <i class="far fa-frown"></i>
        </div>
        <div class="kt-notification__item-details">
            <div class="kt-notification__item-title">
                Oops, Cart's Empty!
            </div>
        </div>
            </div>
        `;
  }
  /* console.log(citemMarkupBundle);
     jhjkhjhjkh
     uhjkh'o*/
  cartItemBody.html(citemMarkupBundle);
}

$(document).on("click", "#minus", function () {
  isTouched = true;
  var gccId = $(this).attr("data-gcc");

  fetch("/user/cartitem/" + gccId, {
    method: "GET",
    headers: {
      "X-CSRF-TOKEN": csrfToken,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      /**
       * Reload user top cart
       */
      reloadCartItem();

      /**
       * Re-calculate total qty and price
       */

      var currentQuantity = Number(cartQuantitySpan.attr("data-qty"));
      var currentTotalPrice = Number(cartTotalAmountSpan.attr("data-pr"));

      var newQuantity = currentQuantity - 1;
      var newPrice = currentTotalPrice - Number($(this).attr("data-pr"));
      cartQuantitySpan.text(newQuantity);
      cartTotalAmountSpan.text(newPrice);

      cartQuantitySpan.attr("data-qty", newQuantity);
      cartTotalAmountSpan.attr("data-pr", newPrice);

      /**
       * Manipulate table dom realtime
       */
      if (data.status && data.status !== null) {
        var rwIdx = $(this).attr("data-idx");
        let table = $("#cartTbl").DataTable();
        // console.log(rwIdx)
        let tempData = cartTbl.row(parseInt(rwIdx));

        var currentRow = table.row(rwIdx).node();
        table.cell(currentRow, 0).data(rwIdx + 1);

        tempData["id"] = data.status.id;
        tempData["giftCodeCategory"] = data.status.giftCodeCategory;
        tempData["quantity"] = data.status.quantity;
        tempData["total"] = data.status.total;

        // console.log(tempData)
        table.row(parseInt(rwIdx)).data(tempData); //this is to update the data in the row cells
        var currentRow = table.row(rwIdx).node();
        table.cell(currentRow, 0).data(rwIdx + 1); //this is to set the S/N field
        table.draw(false);
      } else if (data.status === null) {
        // console.log("yea")
        var rwIdx = $(this).attr("data-idx");
        // console.log(rwIdx)
        let table = $("#cartTbl").DataTable();
        table.row(rwIdx).remove().draw(false);
      }
    });
});

$(document).on("click", "#proceedBtn", function () {
  var btn = $(this);
  btn.addClass(
    "kt-spinner kt-spinner--v2 kt-spinner--right kt-spinner--sm kt-spinner--dark"
  );
  var totalAmount = Number($("#cartTotalAmount").attr("data-pr"));

  var payload = {
    totalAmount,
  };

  $.ajax({
    url: "/user/canmaketransaction",
    method: "POST",
    dataType: "json",
    data: payload,
    headers: {
      "X-CSRF-TOKEN": csrfToken,
    },
    success: function (response) {
      //console.log(response.data);
      displayTransactionBox(response.data);
      btn.removeClass(
        "kt-spinner kt-spinner--v2 kt-spinner--right kt-spinner--sm kt-spinner--dark"
      );
    },
  });

  //
});

var displayTransactionBox = function (canProceedWithTransaction) {
  if (canProceedWithTransaction) {
    console.log("should open transaction");
    $("#optionModal").modal("show");
  } else {
    // console.log("error")
    swal(
      "Transacion quota reached for today",
      "Cannot go beyond $1000 transaction per day",
      "error"
    );
    return false;
  }
};

var initiatePayPalPayment = function () {
  var totalAmount = $("#cartTotalAmount").attr("data-pr");

  var items = [];

  currentCartItem.forEach((item) => {
    var arr = [];
    var { id, quantity, total, createdAt } = item;
    var newItemForm = {
      name: item.giftCodeCategory.title,
      sku: "gcode",
      price: item.giftCodeCategory.sellingPrice,
      currency: "USD",
      quantity: quantity,
    };
    items.push(newItemForm);
  });

  var payload = {
    items,
    totalAmount,
  };

  fetch("/user/pay", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": csrfToken,
    },
  })
    .then((res) => res.json())
    .then((response) => {
      window.location.href = response.data;
    });
};

var initiateBankDepositProcessing = function () {
  var totalAmount = $("#cartTotalAmount").attr("data-pr");
  $("#totalAmount").val(totalAmount);

  let orderFrm = document.getElementById("orderForm");
  let formData = new FormData(orderFrm);

  if (document.getElementById("customFile").files.length == 0) {
    swal(
      "Incomplete Transaction",
      "Receipt is needed as proof of payment",
      "error"
    );
    return false;
  }

  $("#statusModal").modal("show");

  fetch("/user/order", {
    method: "POST",
    body: formData,
    headers: {
      "X-CSRF-TOKEN": csrfToken,
    },
  })
    .then((res) => res.json())
    .then((response) => {
      if (response.status === "false") {
        $("#statusModal").modal("hide");
        swal(response.data, "", "error").then((val) => {
          $("#optionModal").modal("show");
        });
      } else if (response.status === "true") {
        $("#statusModal").modal("hide");
        swal(
          "Transaction has been posted",
          "Transaction will be reviewed and processed",
          "success"
        ).then((val) => {
          window.location.href = "/user/store";
        });
      }
    });
};

// =========================== Code Generation Methods =====================

var spinner2 = $("#spinner2");
var headTitle = $("#head_title");

var initiateCodeGeneration = function (res) {
  if (res.status == "success") {
    let transaction = res.data;
    loadCodeTable(transaction.id);
  } else if (res.status === "false") {
    swal(
      "Payment Failed",
      "Kindly try again or reach the admin.",
      "error"
    ).then((val) => {
      window.location.href = "/user/store";
    });
  }
};

var loadCodeTable = function (tid) {
  $.ajax({
    url: `/user/transaction?tid=${tid}`,
    method: "GET",
    dataType: "json",
    header: {
      "X-CSRF-TOKEN": csrfToken,
    },
    success: function (response) {
      var data = response.data;
      var formattedData = formatData(data);
      bindToCodeTable(formattedData);
    },
  });
};

var formatData = function (data) {
  var obj = [];

  data.forEach((transaction) => {
    var transactType = "";
    transaction.type == 0
      ? (transactType = "Purchase")
      : (transactType = "Sales");
    transaction.giftCodes.forEach((code) => {
      var payload = {
        title: code.giftCodeCategory.title,
        code: code.code,
        date: code.createdAt,
        status: code.isUsed == true ? "Used" : "Not Used",
        type: transactType,
      };
      obj.push(payload);
    });
  });
  console.log(obj);
  return obj;
};

var codeTbl;
var bindToCodeTable = function (response) {
  codeTbl = $("#codeTbl").DataTable({
    aaData: response,
    aoColumns: [
      {
        data: "id",
        render: function (id, type, row, meta) {
          return meta.row + 1;
        },
      },
      {
        data: "title",
      },
      {
        data: "code",
        render: function (code, type, row, meta) {
          return `
                <div class="input-group input-group-sm">
                    <input type="text" class="form-control" value="${code}" id="id_${meta.row}" readonly>
                    <div class="input-group-append">
                        <button class="btn btn-primary btnCopy" type="button" id="btnCopy">Copy</button>
                    </div>
                </div>
                `;
        },
      },
      {
        data: "date",
        render: function (date, type, row, meta) {
          return moment(date).format("LLL");
        },
      },
    ],
  });
  spinner2.hide();
  headTitle.text("Gift Codes");
  $("#optionModal").modal("hide");
  $("#codeModal").modal("show");
};
// =========================== / Code Generation Methods =====================

var initiateCreditCardPayment = function () {};

var initiateOnlinePayment = function () {
  var userFullname = $("#fname").val();
  var phone = $("#phone").val();
  var email = $("#email").val();
  var rate = $("#rate").val();
  var totalAmount = $("#cartTotalAmount").text();

  totalAmount = parseInt(totalAmount);
  console.log(rate);
  console.log(totalAmount);

  var payload = {
    tx_ref: uuidv4(),
    amount: `${totalAmount}`,
    currency: "USD",
    redirect_url: "https://cashgiftcode.com/user/pay-callback",
    payment_options: "card",
    meta: {
      consumer_id: uuidv4(),
      consumer_mac: "92a3-912ba-1192a",
    },
    customer: {
      email: `${email}`,
      phonenumber: `${phone}`,
      name: `${userFullname}`,
    },
    customizations: {
      title: "Payment for Cash GC",
      description: "Payments",
      logo: "https://assets.piedpiper.com/logo.png",
    },
  };

  $.ajax({
    url: "/user/initialize-payment",
    method: "POST",
    dataType: "json",
    data: JSON.stringify(payload),
    headers: {
      "content-type": "application/json",
      "X-CSRF-TOKEN": csrfToken,
    },
    success: function (response) {
      if (response.status == "success") {
        window.location.href = response.data.link;
      } else {
        swal(
          "Kindly Re-Try",
          "We could not reach our payment gateway",
          "error"
        );
      }
    },
  });
};

$("input[name='m_option_1']").on("click", function () {
  var paymentOption = $("input[name='m_option_1']:checked").val();
  var paymentInfoSpan = $("#paymentInfoSpan");
  var cardPaymentSpan = $("#cardPaymentSpan");

  if (paymentOption === "bank") {
    paymentInfoSpan.show("slideIn");
    cardPaymentSpan.hide("fadeOut");
  } else if (paymentOption === "paypal") {
    swal(
      "Service not available",
      "We are sorry to bring to your notice that payment through paypal is currently not available. Kindly pay through the alternative means.",
      "error"
    );
  } else if (paymentOption === "paypalcard") {
    swal(
      "Service not available",
      "We are sorry to bring to your notice that payment through paypal is currently not available. Kindly pay through the alternative means.",
      "error"
    );
  } else if (paymentOption == "onlinepay") {
  }
});

$("#triggerPay").on("click", function () {
  var btn = $(this);
  console.log(btn);

  btn.addClass(
    "kt-spinner kt-spinner--v2 kt-spinner--right kt-spinner--sm kt-spinner--dark"
  );
  btn.attr("disabled", true);
  var totalAmount = Number($("#cartTotalAmount").attr("data-pr"));

  if (totalAmount <= 0) {
    swal("Your cart is empty", "", "error");
    return false;
  }
  var paymentOption = $("input[name='m_option_1']:checked").val();

  if (paymentOption === "onlinepay") {
    // initiatePayPalPayment();
    initiateOnlinePayment();
  } else if (paymentOption === "bank") {
    initiateBankDepositProcessing();
  }
});

$("#closeCodeModal").on("click", function () {
  window.location.href = "/user/my-codes";
});

// ============Private Util method====================================================
async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
