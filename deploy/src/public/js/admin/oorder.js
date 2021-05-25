'use strict';

$(document).ready(function () {
  fetchAdminToken();
  // $('#orderItemModal').modal('show');
});

var spinner = $('#spinner');
var orderStore = [];
var fetchAdminToken = function () {
  $.ajax({
    url:
      'https://www.owolytextreme.ng/order/cashgiftcode/qw-owolyte/get-csrfcode',
    method: 'GET',
    dataType: 'json',
    success: function (response) {
      $('#_csrf').val(response.data);
      loadOrderTable();
    },
  });
};

var spinner = $('#spinner');

var loadOrderTable = function () {
  var csrfToken = $('#_csrf').val();
  $.ajax({
    url: `https://www.owolytextreme.ng/order/${csrfToken}`,
    method: 'GET',
    dataType: 'json',
    headers: {
      'X-CSRF-TOKEN': csrfToken,
    },
    success: function (response) {
      orderStore = response.data;
      bindTableToData(response);
      console.log(response);
    },
  });
};

var orderTbl;
var bindTableToData = function (response) {
  orderTbl = $('#orderTbl').DataTable({
    aaData: response.data,
    aoColumns: [
      {
        data: 'id',
        render: function (id, type, row, meta) {
          return meta.row + 1;
        },
      },
      {
        data: 'id',
        render: function (id, type, row, meta) {
          return row.ecUser.firstname + ' ' + row.ecUser.lastname;
        },
      },
      {
        data: 'reference',
      },
      {
        data: 'id',
        render: function (id, type, row, meta) {
          return row.ecTransaction.reference;
        },
      },
      {
        data: 'id',
        render: function (id, type, row, meta) {
          return 'N' + row.ecTransaction.amount.toLocaleString();
        },
      },
      {
        data: 'isProcessed',
        render: function (isProcessed) {
          if (isProcessed == true) {
            return "<span class='kt-badge kt-badge--success kt-badge--inline'>Processed</span>";
          } else if (isProcessed == false) {
            return "<span class='kt-badge kt-badge--warning kt-badge--inline'>Pending</span>";
          }
        },
      },
      {
        data: 'id',
        render: function (id, type, row, meta) {
          if (row.ecTransaction.status == 'successful') {
            return "<span class='kt-badge kt-badge--success kt-badge--inline'>successful</span>";
          } else {
            return "<span class='kt-badge kt-badge--warning kt-badge--inline'>failed</span>";
          }
        },
      },
      {
        data: 'createdAt',
        render: function (createdAt) {
          return moment(createdAt).format('LLL');
        },
      },
      {
        data: 'id',
        render: function (id, type, row, meta) {
          if (row.isProcessed == true) {
            return 'Order Processed';
          } else {
            return `
                    <span style="overflow: visible; position: relative; width: 110px;">
                    <a title="View Full Details" data-id=${id} id="details" style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md" id="viewOrder"><i class="la la-eye"></i></a>
                        <a id="process" data-idx=${meta.row}
                        title="Process Order" data-oid=${id} style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md"><i data-idx=${meta.row} id="edit" class="la la-check-square"></i></a>
                    </span>
                `;
          }
        },
      },
    ],
  });
  spinner.hide();
};

$('#closeModal').click(function () {
  console.log('close');
  $('#orderItemModal').modal('hide');
});

$(document).on('click', '#process', function () {
  $('#statusModal').modal('show');
  var btn = $(this);
  var oid = btn.attr('data-oid');

  let payload = {
    id: oid,
  };

  var csrfToken = $('#_csrf').val();

  fetch(`https://www.owolytextreme.ng/order/process/${csrfToken}`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept',
    },
  })
    .then((res) => res.json())
    .then((response) => {
      let data = response.data;

      $('#statusModal').modal('hide');
      if (data == true) {
        swal('Order was process successfully', 'success').then((_) => {
          window.location.reload();
        });
      } else {
        swal('Order failed to process', data, 'error');
      }
      console.log(response);
    });
});

$(document).on('click', '#details', function () {
  var btn = $(this);
  var orderId = btn.attr('data-id');
  console.log(orderStore);
  var order = orderStore.filter((order) => order.id == orderId);
  buildOrderItems(order[0]);
});

var buildOrderItems = function (data) {
  var itemBody = $('#orderItemBody');

  $('#uaddress').text(`${data.address}`);
  $('#uname').text(`${data.ecUser.firstname} ${data.ecUser.lastname}`);
  $('#ucontact').text(`${data.ecUser.phone}`);
  $('#uemail').text(`${data.ecUser.email}`);

  var itemContent = '';

  data.ecOrderItems.forEach((item, idx) => {
    console.log(item);
    itemContent += `
      <tr>
          <td>${++idx}</td>
          <td>${item.ecProduct.Name}</td>
          <td>${item.quantity}</td>
          <td>N${item.ecProduct.Price.toLocaleString()}</td>
          <td>N${(item.ecProduct.Price * item.quantity).toLocaleString()}</td>
      </tr>
    `;
  });

  itemBody.html(itemContent);

  $('#orderItemModal').modal('show');
};
