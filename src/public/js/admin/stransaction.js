"use strict";
$(document).ready(function () {
  loadTransactionTable();
});

var csrfToken = $("#_csrf").val();
var spinner = $("#spinner");

var loadTransactionTable = function () {
  $.ajax({
    url: "/admin/transactions?category=sales",
    method: "GET",
    dataType: "json",
    headers: {
      "X-CSRF-TOKEN": csrfToken,
    },
    success: function (response) {
      bindTableToData(response);
    },
  });
};

var sales_transactionTbl;
var bindTableToData = function (response) {
  sales_transactionTbl = $("#sales_transactionTbl").DataTable({
    aaData: response.data,
    aoColumns: [
      {
        data: "id",
        render: function (id, type, row, meta) {
          return meta.row + 1;
        },
      },
      {
        data: "reference",
      },
      {
        data: "type",
        render: function (type) {
          if (type == 0) {
            return "Purchase";
          } else if (type == 1) {
            return "Sales";
          }
        },
      },
      {
        data: "status",
        render: function (status, type, row, meta) {
          if (status == 0) {
            return "<span class='kt-badge kt-badge--success kt-badge--inline'>Success</span>";
          } else if (status == 1) {
            return "<span class='kt-badge kt-badge--danger kt-badge--inline'>Failed</span>";
          } else if (status == 2) {
            return "<span class='kt-badge kt-badge--warning kt-badge--inline'>Pending</span>";
          }
        },
      },
      {
        data: "payment",
        render: function (payment) {
          if (payment == 0) {
            return "Paypal";
          } else if (payment == 1) {
            return "Auto Payout";
          } else if (payment == 2) {
            return "Bitcoin Wallet";
          } else if (payment == 3) {
            return "Manual Payout";
          } else if (payment == 4) {
            return "Manual Payout";
          } else if (payment == 5) {
            return "Auto Payout";
          }
        },
      },
      {
        data: "id",
        render: function (id, type, row, meta) {
          if (row.user && row.user.firstname && row.user.lastname)
            return `${row.user.firstname} ${row.user.lastname}`;
        },
      },
      {
        data: "amount",
        render: function (amount) {
          return amount.toLocaleString();
        },
      },
      {
        data: "message",
        render: function (message, type, row, meta) {
          if (message != null) {
            return message;
          } else {
            return "no message";
          }
        },
      },
      {
        data: "id",
        render: function (id, type, row, meta) {
          if (row.payment == 2 && row.type == 1) {
            //bitcoin transaction
            return `
                    <span style="overflow: visible; position: relative; width: 110px;">
                        <a id="approveTransaction" data-id=${id} data-idx=${meta.row}
                        title="Approve Bitcoin Transaction" data-tid=${id} style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md"><i data-idx=${meta.row} id="edit" class="la la-check-square"></i></a>
                        <a title="Decline Bitcoin Transaction" id="declineTransaction" data-idx=${meta.row} data-tid=${id} style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md"><i data-idx=${meta.row} class="la la-ban"></i></a>
                        <a data-userid=${row.user.id} title="View User Wallet" style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md" id="viewWallet"><i class="la la-eye"></i></a>
                    </span>
                `;
          } else if (row.payment == 3 && row.type == 0) {
            //bank order transaction
            if (row.status == 2) {
              return `
                            <a href="/admin/orders">Process Transaction</a>
                        `;
            } else {
              return "Processed";
            }
          } else if (row.payment == 4 && row.type == 1) {
            //manual payout transaction
            return `
                    <span style="overflow: visible; position: relative; width: 110px;">
                        <a id="approveTransaction" data-id=${id} data-idx=${meta.row}
                        title="Approve Manual Payout Transaction" data-tid=${id} style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md"><i data-idx=${meta.row} id="edit" class="la la-check-square"></i></a>
                        <a title="Decline Manual Payout Transaction" id="declineTransaction" data-idx=${meta.row} data-tid=${id} style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md"><i data-idx=${meta.row} class="la la-ban"></i></a>
                        <a data-userid=${row.user.id} title="View Bank Details" style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md" id="viewUserAccount"><i class="la la-eye"></i></a>
                    </span>
                `;
          } else if (row.payment == 5 && row.status == 2) {
            return `
                    <span style="overflow: visible; position: relative; width: 110px;">
                        <a id="approveTransaction" data-id=${id} data-idx=${meta.row}
                        title="Approve Payout Transaction" data-tid=${id} style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md"><i data-idx=${meta.row} id="edit" class="la la-check-square"></i></a>
                        <a title="Decline Payout Transaction" id="declineTransaction" data-idx=${meta.row} data-tid=${id} style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md"><i data-idx=${meta.row} class="la la-ban"></i></a>
                        <a data-userid=${row.user.id} title="View Bank Details" style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md" id="viewUserAccount"><i class="la la-eye"></i></a>
                    </span>
                `;
          } else {
            return "-";
          }
        },
      },
    ],
  });
  spinner.hide();
};

// show user wallet details
$(document).on("click", "#viewWallet", function (e) {
  e.preventDefault();
  var userId = $(this).attr("data-userid");
  // console.log(userId)

  $.ajax({
    url: `/admin/wallet/${userId}`,
    method: "GET",
    dataType: "json",
    headers: {
      "X-CSRF-TOKEN": csrfToken,
    },
    success: function (response) {
      displayUserWallet(response.data);
    },
  });
});

// show user account details
$(document).on("click", "#viewUserAccount", function (e) {
  e.preventDefault();
  var userId = $(this).attr("data-userid");
  // console.log(userId)

  $.ajax({
    url: `/admin/getUserAccount/${userId}`,
    method: "GET",
    dataType: "json",
    headers: {
      "X-CSRF-TOKEN": csrfToken,
    },
    success: function (response) {
      displayUserAccount(response.data);
      // console.log(response.data)
    },
  });
});

$(document).on("click", "#approveTransaction", function (e) {
  var transactId = $(this).attr("data-tid");
  var rwIdx = $(this).attr("data-idx");

  $.ajax({
    url: `/admin/transactions/?tid=${transactId}&operation=approve`,
    method: "POST",
    dataType: "json",
    headers: {
      "X-CSRF-TOKEN": csrfToken,
    },
    success: function (response) {
      let data = response.data;
      console.log(data);
      swal("Transaction approved!", "", "success");

      updateTableRow(data, rwIdx);
    },
  });
});

$(document).on("click", "#declineTransaction", function (e) {
  var transactId = $(this).attr("data-tid");
  var rwIdx = $(this).attr("data-idx");

  $.ajax({
    url: `/admin/transactions/?tid=${transactId}&operation=decline`,
    method: "POST",
    dataType: "json",
    headers: {
      "X-CSRF-TOKEN": csrfToken,
    },
    success: function (response) {
      let data = response.data;
      swal("Transaction declined!", "", "success");

      updateTableRow(data, rwIdx);
    },
  });
});

document.addEventListener(
  "click",
  function (e) {
    if (e.target.classList.contains("btnCopy")) {
      var btn = e.target;
      var input = btn.parentNode.parentNode.children[0];
      var inpId = input.getAttribute("id");

      var copyText = document.getElementById(inpId);
      copyText.select();
      document.execCommand("copy");
    }
  },
  false
);

function updateTableRow(data, rwIdx) {
  var table = $("#sales_transactionTbl").DataTable();
  var tempData = sales_transactionTbl.row(parseInt(rwIdx));

  var currentRow = table.row(rwIdx).node();
  table.cell(currentRow, 0).data(rwIdx + 1);

  tempData["id"] = data.id;
  tempData["reference"] = data.reference;
  tempData["type"] = data.type;
  tempData["status"] = data.status;
  tempData["payment"] = data.payment;
  tempData["user"] = data.user;
  tempData["amount"] = data.amount;

  table.row(parseInt(rwIdx)).data(tempData); //this is to update the data in the row cells
  var currentRow = table.row(rwIdx).node();
  table.cell(currentRow, 0).data(rwIdx + 1); //this is to set the S/N field
  table.draw(false);
}

function displayUserWallet(data) {
  $("#modalBody").empty();
  if (data) {
    $("#modalBody").append(`
            <div class="input-group input-group-sm">
                <input type="text" class="form-control" value="${data.wid}" id="id_${data.id}" readonly>
                <div class="input-group-append">
                    <button class="btn btn-primary btnCopy" type="button" id="btnCopy">Copy</button>
                </div>
            </div>
        `);
  } else {
    $("#modalBody").append(`
        <p>User has no wallet ID!</p>
    `);
  }
  $("#walletModal").modal("show");
}

function displayUserAccount(data) {
  $("#bankName").text("");
  $("#accNumber").text("");
  if (data) {
    $("#bankName").text(data.name);
    $("#accNumber").text(data.number);
    $("#accountModal").modal("show");
  } else {
    $("#accountModal").append(`
        <p>User has no account info!</p>
    `);
  }
}
