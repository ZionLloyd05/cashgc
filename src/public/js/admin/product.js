'use strict';
$(document).ready(function () {
  fetchAdminToken();
});

var spinner = $('#spinner');

var fetchAdminToken = function () {
  $.ajax({
    url:
      'https://www.owolytextreme.ng/product/cashgiftcode/qw-owolyte/get-csrfcode',
    method: 'GET',
    dataType: 'json',
    success: function (response) {
      $('#_csrf').val(response.data);
      fetchOwolyteProducts();
    },
  });
};

var fetchOwolyteProducts = function () {
  var csrfToken = $('#_csrf').val();
  $.ajax({
    url: `https://www.owolytextreme.ng/product/${csrfToken}`,
    method: 'GET',
    dataType: 'json',
    success: function (response) {
      bindTableToData(response);
    },
  });
};

var productTbl;
var bindTableToData = function (response) {
  productTbl = $('#productTbl').DataTable({
    aaData: response.data,
    aoColumns: [
      {
        data: 'id',
        render: function (id, type, row, meta) {
          return meta.row + 1;
        },
      },
      {
        data: 'Name',
      },
      {
        data: 'ImageUrl',
        render: function (ImageUrl, type, row, meta) {
          return (
            '<a href=' +
            ImageUrl +
            " target='_blank' class='kt-font-bold kt-font-primary'>View Image</a>"
          );
        },
      },
      {
        data: 'Price',
      },
      {
        data: 'Description',
      },
      {
        data: 'InStock',
        render: function (InStock, type, row, meta) {
          if (InStock) {
            return "<span style='cursor:pointer' class='kt-badge kt-badge--brand kt-badge--inline kt-badge--pill'>Available</span>";
          } else {
            return "<span style='cursor:pointer' class='kt-badge  kt-badge--danger kt-badge--inline kt-badge--pill'>Not Available</span>";
          }
        },
      },
      {
        data: 'id',
        render: function (id, type, row, meta) {
          return `
                    <span style="overflow: visible; position: relative; width: 110px;">
                        <a id="edit" data-idx='${meta.row}' data-id=${id} data-name='${row.Name}' data-price='${row.Price}' data-description='${row.Description}' data-instock='${row.InStock}' 
                        title="Edit details" style='cursor:pointer' class="btn btn-sm btn-clean btn-icon btn-icon-md"><i id="edit" class="la la-edit"></i></a>
                    </span>
                `;
        },
      },
    ],
  });
  spinner.hide();
};

var form = $('#productFrm');

$('#save').click(function (e) {
  var csrfToken = $('#_csrf').val();
  let btnSpinner = $('#btnSpinner');

  e.preventDefault();
  btnSpinner.show();

  let prdFrm = document.getElementById('productFrm');
  let formData = new FormData(prdFrm);

  fetch(`https://www.owolytextreme.ng/product/${csrfToken}`, {
    method: 'POST',
    body: formData,
  })
    .then((res) => res.json())
    .then((response) => {
      if (response.status == 'created') {
        let data = response.data;

        // CREATE NEW ROW
        var table = $('#productTbl').DataTable();
        table.row
          .add({
            id: data.id,
            Name: data.Name,
            ImageUrl: data.ImageUrl,
            Price: data.Price,
            Description: data.Description,
            InStock: data.InStock,
          })
          .draw();

        swal('Product was creaated.', '', 'success');
      } else if (response.status == 'updated') {
        let data = response.data;

        var rwIdx = $(this).attr('data-idx');

        var table = $('#productTbl').DataTable();
        var tempData = productTbl.row(parseInt(rwIdx));

        var currentRow = table.row(rwIdx).node();
        table.cell(currentRow, 0).data(rwIdx + 1);

        tempData['id'] = data.id;
        tempData['Name'] = data.Name;
        tempData['ImageUrl'] = data.ImageUrl;
        tempData['Price'] = data.Price;
        tempData['Description'] = data.Description;
        tempData['InStock'] = data.InStock;

        table.row(parseInt(rwIdx)).data(tempData); //this is to update the data in the row cells
        var currentRow = table.row(rwIdx).node();
        table.cell(currentRow, 0).data(rwIdx + 1); //this is to set the S/N field
        table.draw(false);

        swal('Product Modified', '', 'success');
      }

      btnSpinner.hide();
      clearInputs();
    })
    .catch((err) => {
      console.log(err);
      btnSpinner.hide();
    });
});

// edit and delete
// edit first
$(document).on('click', '#edit', function (e) {
  e.stopPropagation();
  var edit = $(this);
  var editBtn;

  var tgname = edit.prop('tagName');
  if (tgname == 'I') {
    editBtn = edit.parent();
  } else if (tgname == 'A') {
    editBtn = edit;
  }
  console.log(editBtn);
  // assign attrribute to modal controls
  var idx = editBtn.attr('data-idx');
  $('#save').attr('data-idx', idx);

  var id = editBtn.attr('data-id');
  $('#id').val(id);

  var Name = editBtn.attr('data-name');
  $('#name').val(Name);

  var Price = editBtn.attr('data-price');
  $('#price').val(Price);

  var Description = editBtn.attr('data-description');
  $('#description').val(Description);

  var InStock = editBtn.attr('data-instock');
  console.log(InStock);
  if (InStock == 'true') {
    $('#instock').prop('checked', true);
  } else {
    $('#innotstock').prop('checked', true);
  }

  $('#productModalLabel').text('Edit Code Category');
  $('#productModal').modal('show');
});

$('#modalClose').on('click', function () {
  clearInputs();
});

function clearInputs() {
  $('#name').val('');
  $('#price').val('');
  $('#description').val('');
  $('#id').val('');

  let $el = $('#image');
  $el.wrap('<form>').closest('form').get(0).reset();
  $el.unwrap();

  $('#productModalLabel').text('New Product');
}
