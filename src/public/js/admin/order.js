'use strict';
$(document).ready(function () {
  loadOrderTable();
});

var csrfToken = $('#_csrf').val();
var spinner = $('#spinner');

var loadOrderTable = function () {
  $.ajax({
    url: '/admin/order',
    method: 'GET',
    dataType: 'json',
    headers: {
      'X-CSRF-TOKEN': csrfToken,
    },
    success: function (response) {
      bindTableToData(response);
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
          return row.transaction.reference;
        },
      },
      {
        data: 'receiptUrl',
        render: function (imageUrl) {
          return (
            '<a href=' +
            imageUrl +
            " target='_blank' class='kt-font-bold kt-font-primary'>View Image</a>"
          );
        },
      },
      {
        data: 'isProcessed',
        render: function (isProcessed) {
          if (isProcessed == true) {
            return "<span class='kt-badge kt-badge--success kt-badge--inline'>Processed</span>";
          } else if (isProcessed == false) {
            return "<span class='kt-badge kt-badge--warning kt-badge--inline'>Not Processed</span>";
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
                        title="Process Order" data-oid=${id} data-tid=${row.transaction.id} data-uid=${row.transaction.user.id} style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md"><i data-idx=${meta.row} id="edit" class="la la-check-square"></i></a>
                    </span>
                `;
          }
        },
      },
    ],
  });
  spinner.hide();
};

$(document).on('click', '#process', function () {
  $('#statusModal').modal('show');
  var btn = $(this);
  var oid = btn.attr('data-oid');
  var uid = btn.attr('data-uid');
  var rwIdx = btn.attr('data-idx');

  let payload = {
    oid,
    uid,
  };

  fetch(`/admin/order`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken,
    },
  })
    .then((res) => res.json())
    .then((response) => {
      $('#statusModal').modal('hide');
      let data = response.data;
      if (typeof data == 'object') {
        swal(
          'Order was process successfully',
          'Order has been processed and  giftcode has been sent.',
          'success'
        );
        updateTableRow(data, rwIdx);
      } else {
        swal('Order failed to process', data, 'error');
      }
      console.log(response);
    });
});

$(document).on('click', '#details', function () {
  var btn = $(this);
  var rwId = btn.attr('data-id');

  $.ajax({
    url: `/admin/order?id=${rwId}`,
    method: 'GET',
    dataType: 'json',
    headers: {
      'X-CSRF-TOKEN': csrfToken,
    },
    success: function (response) {
      buildOrderItems(
        response.data.orderItems,
        response.data.transaction.amount
      );
    },
  });
});

var buildOrderItems = function (items, total) {
  var itemSpan = $('#itemSpan');
  var itemSpanTotal = $('#itempSpanTotal');

  itemSpan.empty();
  itemSpanTotal.empty();

  items.forEach((item) => {
    itemSpan.append(`
            <div class="mb-3">
                <h6 class="kt-widget-13__title"><i class="la la-bookmark"></i> ${item.giftCodeCategory.title} GC - x${item.quantity}</h6>
            </div>
        `);
  });

  itemSpanTotal.append(`
        <h3 class="kt-widget-13__title" href="#">Total : #${total.toLocaleString()}</h3>
    `);

  $('#orderModal').modal('show');
};

var updateTableRow = function (data, rwIdx) {
  var table = $('#orderTbl').DataTable();
  var tempData = orderTbl.row(parseInt(rwIdx));

  var currentRow = table.row(rwIdx).node();
  table.cell(currentRow, 0).data(rwIdx + 1);

  tempData['id'] = data.id;
  tempData['receiptUrl'] = data.receiptUrl;
  tempData['isProcessed'] = data.isProcessed;
  tempData['createdAt'] = data.status;
  tempData['transaction'] = data.transaction;

  table.row(parseInt(rwIdx)).data(tempData); //this is to update the data in the row cells
  var currentRow = table.row(rwIdx).node();
  table.cell(currentRow, 0).data(rwIdx + 1); //this is to set the S/N field
  table.draw(false);
};
