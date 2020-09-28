'use strict';

var cart = $('#cart_no');
var csrfToken = $('#_csrf').val();
var total = $('#totalPrice');
var cartItemTotal = $('#cartItemTotal');
var cartItemBody = $('#cartItemBody');

$(document).ready(function () {
  fetch('/user/cartitem/', {
    method: 'GET',
    headers: {
      'X-CSRF-TOKEN': csrfToken,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      prepareCart(res.data);
    })
    .catch((err) => console.log(err));
});

function prepareCart(data) {
  let { items, totalQuantity, totalPrice } = data;

  cart.text(totalQuantity);
  let itemString = '';

  totalQuantity > 1
    ? (itemString = `${totalQuantity} cart items`)
    : (itemString = `${totalQuantity} cart item`);

  cartItemTotal.text(itemString);

  total &&
    total.text(totalPrice.toLocaleString()) &&
    total.attr('data-pr', totalPrice);

  let citemMarkupBundle = '';
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
