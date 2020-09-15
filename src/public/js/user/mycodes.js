"use strict";
$(document).ready(function () {
  loadCodeTable();
  $("#kt_toast_1").toast({
    delay: 4e3,
  });
  var transactionRef = GetURLParameter("transref");
  if (transactionRef != undefined) {
    initiateCodeGeneration(transactionRef);
  }
});

var csrfToken = $("#_csrf").val();
var spinner = $("#spinner");

var loadCodeTable = function () {
  $.ajax({
    url: "/user/transaction",
    method: "GET",
    dataType: "json",
    header: {
      "X-CSRF-TOKEN": csrfToken,
    },
    success: function (response) {
      var data = response.data;
      var formattedData = formatData(data);
      bindTableToData(formattedData);
    },
  });
};

var spinner2 = $("#spinner2");
var headTitle = $("#head_title");

var codeTbl;
var bindTableToData = function (response) {
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
                        <button data-clipboard-text="${code}" class="btn btn-primary btnCopy" type="button">Copy</button>
                    </div>
                </div>
                `;
        },
      },
      {
        data: "isActivated",
        render: function (isActivated, type, row, meta) {
          if (row.type == "Sales") {
            return `<span class="kt-badge  kt-badge--primary kt-badge--inline kt-badge--pill">Sold</span>`;
          } else if (isActivated == true)
            return `<span class="kt-badge  kt-badge--primary kt-badge--inline kt-badge--pill">Active</span>`;
          else
            return `<span class="kt-badge  kt-badge--danger kt-badge--inline kt-badge--pill">Inactive</span>`;
        },
      },
      {
        data: "date",
        render: function (date, type, row, meta) {
          return moment(date).format("LLL");
        },
      },
      {
        data: "status",
        render: function (data, type, row, meta) {
          if (data == "Used")
            return `<span class="kt-badge  kt-badge--danger kt-badge--inline kt-badge--pill">${data}</span>`;
          else
            return `<span class="kt-badge  kt-badge--primary kt-badge--inline kt-badge--pill">${data}</span>`;
        },
      },
      {
        data: "type",
      },
    ],
  });
  spinner.hide();
};

var initiateCodeGeneration = function (tid) {
  loadCodeTableForTransaction(tid);
};

var loadCodeTableForTransaction = function (tid) {
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
        isActivated: code.isActivated,
      };
      obj.push(payload);
    });
  });
  return obj;
};

var bindToCodeTable = function (response) {
  codeTbl = $("#codeTblForPurchase").DataTable({
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
                      <input type="text" class="form-control" value="${code}" id="id_${meta.row}_forpurchase" readonly>
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
  $("#codeForPurchaseModal").modal("show");
};

var clipboard = new ClipboardJS(".btnCopy");

clipboard.on("success", function (e) {
  swal("Code Copied", "", "success");
  e.clearSelection();
});

clipboard.on("error", function (e) {});

//=========== private util method ==============================
function GetURLParameter(sParam) {
  var sPageURL = window.location.search.substring(1);

  var sURLVariables = sPageURL.split("?");

  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split("=");

    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}
