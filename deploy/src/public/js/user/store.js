var spinner = $('#spinner');

var authField;
$(document).ready(function () {
  authField = $('#authverv');
  if (authField.val() != '0123') confirmVerificationStatus();
  loadCodeCategories();

  var status = GetURLParameter('paymentstatus');
  if (status == 'failed') {
    swal('Patment was not successful', 'Kindly re-try again', 'error');
  }
});

var cart = $('#cart_no');
var csrfToken = $('#_csrf').val();

var cartItemTotal = $('#cartItemTotal');
var cartItemBody = $('#cartItemBody');

function confirmVerificationStatus() {
  $.ajax({
    url: '/user/authcheck',
    method: 'get',
    dataType: 'json',
    headers: {
      'X-CSRF-TOKEN': csrfToken,
    },
    success: function (response) {
      console.log(response.status);
      if (response.status != true) {
        swal(
          'Account not verified',
          'Your account has to be verified to make transactions, click ok to verify now.',
          'info'
        ).then((val) => {
          window.location = '/user/profile';
        });
      }
      authField.val('0123');
    },
  });
}

var onlineCheck = function () {
  const proxyURL = 'https://cors-anywhere.herokuapp.com/';
  const requestURL =
    'https://res.cloudinary.com/zionlloyd/image/upload/v1566997408/Date.png';
  let xhr = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    xhr.onload = () => {
      // Set online status
      resolve(true);
    };
    xhr.onerror = () => {
      // Set online status
      reject(false);
    };
    xhr.open('GET', proxyURL + requestURL, true);
    xhr.send();
  });
};

var loadCodeCategories = function () {
  $.ajax({
    url: '/user/category',
    method: 'GET',
    dataType: 'json',
    header: {
      'X-CSRF-TOKEN': csrfToken,
    },
    success: function (response) {
      buildCodeCategory(response.data);
      document.addEventListener(
        'click',
        function (event) {
          if (event.target.classList.contains('addtocart')) {
            var btnId = event.target.getAttribute('id');
            var itemId = event.target.getAttribute('data-cid');
            addItemToCart(btnId, itemId);
          }
        },
        false
      );
    },
  });
};

function buildCodeCategory(data = []) {
  var storeBody = $('#storeBody');
  var categoryBuilds = '';
  data.forEach((category, idx) => {
    categoryBuilds += '<div class="col-md-4 mb-4">';
    categoryBuilds += '<div class="card">';
    categoryBuilds +=
      '<div class=""><img class="width__100" src="' +
      category.imageUrl +
      '"/></div>';
    categoryBuilds += '<div class="card-body"><div class="row mb-3">';
    categoryBuilds +=
      '<div class="col-7"><h5 class="card-title">Price: $' +
      category.sellingPrice +
      '.00</h5></div>';
    categoryBuilds +=
      '<div class="col-5"><input type="number" value="" placeholder="Quantity" name="qty" id="qty" class="input-sm form-control"></div></div>';
    categoryBuilds +=
      '<button type="button" data-pr="' +
      category.sellingPrice +
      '" class="btn btn-sm btn-brand pull-right addtocart" data-cid=' +
      category.id +
      ' id="addtocart' +
      idx +
      '">Add to Cart</button>';
    categoryBuilds += '</div></div></div>';
  });
  spinner.hide();
  storeBody.html(categoryBuilds);
}
// var totalForTransaction = 0;
function addItemToCart(btnId, itemId) {
  const MAX_TRANSACTION_LIMIT = 500;

  var cart = document.getElementById('cart_no');
  var totalPrice = document.getElementById('totalPrice');
  var totalPriceValue = totalPrice.getAttribute('data-pr');

  var cartBtn = document.getElementById(btnId);
  var itemPrice = cartBtn.getAttribute('data-pr');

  var input = cartBtn.parentNode.children[0].children[1].children[0];
  var qty = input.value;
  input.value = '';

  if (qty == '') qty = 1;

  qty = Number(qty);

  let supposeTotalPrice = Number(totalPriceValue) + Number(itemPrice) * qty;
  // console.log(newTotalPrice);

  if (qty < 1) {
    swal(
      'Invalid Quantity',
      'Negative quantity cannot be added to cart!',
      'error'
    );
    return false;
  } else if (supposeTotalPrice > MAX_TRANSACTION_LIMIT) {
    swal(
      'Maximum transaction limit is $500',
      'Single transaction cannot exceed $500',
      'error'
    );
    return false;
  } else {
    let newTotalPrice = Number(totalPriceValue) + Number(itemPrice) * qty;
    // console.log("newTotalPrice => " + newTotalPrice)
    totalPrice.textContent = newTotalPrice.toLocaleString();
    totalPrice.setAttribute('data-pr', newTotalPrice);
    // console.log("totalPrice => " + totalPrice.textContent)

    var newCartCount = Number(cart.textContent) + qty;
    // console.log("newCartCount => " + newCartCount)

    cart.textContent = newCartCount.toString();

    let payload = {
      gcId: itemId,
      qty,
    };
    // console.log(payload);

    fetch('/user/cartitem', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
      },
    }).then(() => reloadCartItem());
  }
}

function reloadCartItem() {
  // console.log("reload cart item")
  // debugger
  fetch('/user/cartitem/', {
    method: 'GET',
    headers: {
      'X-CSRF-TOKEN': csrfToken,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      prepareCartInStore(res.data);
    })
    .catch((err) => console.log(err));
}

function prepareCartInStore(data) {
  // console.log("preparing in store")
  let { items, totalQuantity, totalPrice } = data;

  // cart.text(totalQuantity)
  let itemString = '';

  totalQuantity > 1
    ? (itemString = `${totalQuantity} cart items`)
    : (itemString = `${totalQuantity} cart item`);

  cartItemTotal.text(itemString);
  // total && total.text(totalPrice)

  let citemMarkupBundle = '';
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
  // console.log(citemMarkupBundle);
  cartItemBody.html(citemMarkupBundle);
}

/**
 * Clears user's cart on btn click
 */
$(document).on('click', '#clearCart', function (e) {
  e.stopPropagation();
  e.preventDefault();
  clearCart();
});

var clearCart = function () {
  var csrfToken = $('#_csrf').val();
  var clearCartBtn = $('#clearCart');
  clearCartBtn.addClass(
    'kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--primary'
  );
  fetch('/user/cartitem', {
    method: 'DELETE',
    headers: {
      'X-CSRF-TOKEN': csrfToken,
    },
  }).then(function () {
    clearCartBtn.removeClass(
      'kt-spinner kt-spinner--v2 kt-spinner--sm kt-spinner--primary'
    );
    window.location.reload();
  });
};

$('#toCart').on('click', function () {
  window.location.href = '/user/cart';
});

//=========== private util method ==============================
function GetURLParameter(sParam) {
  var sPageURL = window.location.search.substring(1);

  var sURLVariables = sPageURL.split('?');

  console.log(sURLVariables);

  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}
