var _0x5cd1 = [
  'address',
  'show',
  'log',
  'text',
  'status',
  'Price',
  '#orderItemModal',
  '#spinner',
  'ajax',
  'LLL',
  'val',
  'hide',
  'firstname',
  '</td>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<td>',
  'stringify',
  'format',
  'ecOrderItems',
  '#uemail',
  'success',
  '#uname',
  '\x20id=\x22details\x22\x20style=\x27cursor:pointer\x27\x20class=\x22btn\x20btn-sm\x20btn-clean\x20btn-icon\x20btn-icon-md\x22\x20id=\x22viewOrder\x22><i\x20class=\x22la\x20la-eye\x22></i></a>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<a\x20id=\x22process\x22\x20data-idx=',
  'filter',
  'ecTransaction',
  'quantity',
  '#statusModal',
  'data',
  'then',
  'attr',
  'json',
  '#_csrf',
  'DataTable',
  '</td>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<td>N',
  'createdAt',
  'application/json',
  '#ucontact',
  'forEach',
  '<span\x20class=\x27kt-badge\x20kt-badge--warning\x20kt-badge--inline\x27>failed</span>',
  'row',
  'GET',
  '\x20style=\x27cursor:pointer\x27\x20class=\x22btn\x20btn-sm\x20btn-clean\x20btn-icon\x20btn-icon-md\x22><i\x20data-idx=',
  '#process',
  '#uaddress',
  '<span\x20class=\x27kt-badge\x20kt-badge--warning\x20kt-badge--inline\x27>Pending</span>',
  'Order\x20Processed',
  'https://www.owolytextreme.ng/order/cashgiftcode/qw-owolyte/get-csrfcode',
  'data-id',
  'location',
  'reference',
  'POST',
  'isProcessed',
  'ecUser',
  'https://www.owolytextreme.ng/order/process/',
  'Order\x20was\x20process\x20successfully',
  '<span\x20class=\x27kt-badge\x20kt-badge--success\x20kt-badge--inline\x27>Processed</span>',
  'Name',
  'successful',
  'Origin,\x20X-Requested-With,\x20Content-Type,\x20Accept',
  'https://www.owolytextreme.ng/order/',
  'lastname',
  'Order\x20failed\x20to\x20process',
  'ecProduct',
  'html',
  '#closeModal',
  'click',
  'email',
  'reload',
  'ready',
  'close',
  '<span\x20class=\x27kt-badge\x20kt-badge--success\x20kt-badge--inline\x27>successful</span>',
  '</td>\x0a\x20\x20\x20\x20\x20\x20</tr>\x0a\x20\x20\x20\x20',
  '#details',
  'toLocaleString',
  '\x0a\x20\x20\x20\x20\x20\x20<tr>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<td>',
  'data-oid',
  'phone',
  'modal',
];
(function (_0x2fe765, _0x5cd11e) {
  var _0x53a5e2 = function (_0x3fef7d) {
    while (--_0x3fef7d) {
      _0x2fe765['push'](_0x2fe765['shift']());
    }
  };
  _0x53a5e2(++_0x5cd11e);
})(_0x5cd1, 0x1a9);
var _0x53a5 = function (_0x2fe765, _0x5cd11e) {
  _0x2fe765 = _0x2fe765 - 0x0;
  var _0x53a5e2 = _0x5cd1[_0x2fe765];
  return _0x53a5e2;
};
var _0x32a830 = _0x53a5;
('use strict');
$(document)[_0x32a830('0x15')](function () {
  fetchAdminToken();
});
var orderTbl,
  spinner = $(_0x32a830('0x26')),
  orderStore = [],
  fetchAdminToken = function () {
    var _0x2ee3e1 = _0x32a830;
    $[_0x2ee3e1('0x27')]({
      url: _0x2ee3e1('0x4b'),
      method: _0x2ee3e1('0x45'),
      dataType: 'json',
      success: function (_0x3fef7d) {
        var _0x5a2a04 = _0x2ee3e1;
        $(_0x5a2a04('0x3c'))[_0x5a2a04('0x29')](_0x3fef7d[_0x5a2a04('0x38')]),
          loadOrderTable();
      },
    });
  },
  loadOrderTable =
    ((spinner = $(_0x32a830('0x26'))),
    function () {
      var _0x4191d1 = _0x32a830,
        _0x25cab6 = $(_0x4191d1('0x3c'))[_0x4191d1('0x29')]();
      $[_0x4191d1('0x27')]({
        url: _0x4191d1('0xc') + _0x25cab6,
        method: _0x4191d1('0x45'),
        dataType: 'json',
        headers: { 'X-CSRF-TOKEN': _0x25cab6 },
        success: function (_0x233fd1) {
          var _0x1e3f19 = _0x4191d1;
          (orderStore = _0x233fd1[_0x1e3f19('0x38')]),
            bindTableToData(_0x233fd1),
            console[_0x1e3f19('0x21')](_0x233fd1);
        },
      });
    }),
  bindTableToData = function (_0x563c4c) {
    var _0x3fd8ca = _0x32a830;
    (orderTbl = $('#orderTbl')[_0x3fd8ca('0x3d')]({
      aaData: _0x563c4c[_0x3fd8ca('0x38')],
      aoColumns: [
        {
          data: 'id',
          render: function (_0x35d417, _0x1007a5, _0x528f81, _0x5475a3) {
            var _0x44fa03 = _0x3fd8ca;
            return _0x5475a3[_0x44fa03('0x44')] + 0x1;
          },
        },
        {
          data: 'id',
          render: function (_0x4e660c, _0x392286, _0x2023df, _0x12f7f8) {
            var _0x4d4e40 = _0x3fd8ca;
            return (
              _0x2023df[_0x4d4e40('0x5')][_0x4d4e40('0x2b')] +
              '\x20' +
              _0x2023df['ecUser'][_0x4d4e40('0xd')]
            );
          },
        },
        { data: _0x3fd8ca('0x2') },
        {
          data: 'id',
          render: function (_0x2500ae, _0x3b0788, _0x372e52, _0x3bbedc) {
            var _0x2430a0 = _0x3fd8ca;
            return _0x372e52[_0x2430a0('0x35')][_0x2430a0('0x2')];
          },
        },
        {
          data: 'id',
          render: function (_0x167f19, _0x5cc570, _0x39f2c3, _0x132c7b) {
            var _0x46a44b = _0x3fd8ca;
            return (
              'N' + _0x39f2c3[_0x46a44b('0x35')]['amount'][_0x46a44b('0x1a')]()
            );
          },
        },
        {
          data: _0x3fd8ca('0x4'),
          render: function (_0x50f0da) {
            var _0x1da8ab = _0x3fd8ca;
            return 0x1 == _0x50f0da
              ? _0x1da8ab('0x8')
              : 0x0 == _0x50f0da
              ? _0x1da8ab('0x49')
              : void 0x0;
          },
        },
        {
          data: 'id',
          render: function (_0x4a199a, _0x5885e6, _0x4359e8, _0x3ec900) {
            var _0x1aa8ee = _0x3fd8ca;
            return _0x1aa8ee('0xa') ==
              _0x4359e8[_0x1aa8ee('0x35')][_0x1aa8ee('0x23')]
              ? _0x1aa8ee('0x17')
              : _0x1aa8ee('0x43');
          },
        },
        {
          data: _0x3fd8ca('0x3f'),
          render: function (_0x4c40d2) {
            var _0x33fb0a = _0x3fd8ca;
            return moment(_0x4c40d2)[_0x33fb0a('0x2e')](_0x33fb0a('0x28'));
          },
        },
        {
          data: 'id',
          render: function (_0x45f2fa, _0x1fb03d, _0x819237, _0x196634) {
            var _0xbda288 = _0x3fd8ca;
            return 0x1 == _0x819237[_0xbda288('0x4')]
              ? _0xbda288('0x4a')
              : '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20style=\x22overflow:\x20visible;\x20position:\x20relative;\x20width:\x20110px;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<a\x20title=\x22View\x20Full\x20Details\x22\x20data-id=' +
                  _0x45f2fa +
                  _0xbda288('0x33') +
                  _0x196634[_0xbda288('0x44')] +
                  '\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20title=\x22Process\x20Order\x22\x20data-oid=' +
                  _0x45f2fa +
                  _0xbda288('0x46') +
                  _0x196634[_0xbda288('0x44')] +
                  '\x20id=\x22edit\x22\x20class=\x22la\x20la-check-square\x22></i></a>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20';
          },
        },
      ],
    })),
      spinner[_0x3fd8ca('0x2a')]();
  };
$(_0x32a830('0x11'))[_0x32a830('0x12')](function () {
  var _0x3dcdc6 = _0x32a830;
  console[_0x3dcdc6('0x21')](_0x3dcdc6('0x16')),
    $(_0x3dcdc6('0x25'))[_0x3dcdc6('0x1e')](_0x3dcdc6('0x2a'));
}),
  $(document)['on'](_0x32a830('0x12'), _0x32a830('0x47'), function () {
    var _0x5aae6f = _0x32a830;
    $('#statusModal')['modal'](_0x5aae6f('0x20'));
    let _0x1cb32d = { id: $(this)[_0x5aae6f('0x3a')](_0x5aae6f('0x1c')) };
    var _0x388c2a = $(_0x5aae6f('0x3c'))[_0x5aae6f('0x29')]();
    fetch(_0x5aae6f('0x6') + _0x388c2a, {
      method: _0x5aae6f('0x3'),
      body: JSON[_0x5aae6f('0x2d')](_0x1cb32d),
      headers: {
        'Content-Type': _0x5aae6f('0x40'),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': _0x5aae6f('0xb'),
      },
    })
      [_0x5aae6f('0x39')]((_0x4a4eff) => _0x4a4eff[_0x5aae6f('0x3b')]())
      [_0x5aae6f('0x39')]((_0x3c4ebd) => {
        var _0xc6c421 = _0x5aae6f;
        let _0x56267e = _0x3c4ebd[_0xc6c421('0x38')];
        $(_0xc6c421('0x37'))[_0xc6c421('0x1e')]('hide'),
          0x1 == _0x56267e
            ? swal(_0xc6c421('0x7'), _0xc6c421('0x31'))[_0xc6c421('0x39')](
                (_0x5379e3) => {
                  var _0x76eaf9 = _0xc6c421;
                  window[_0x76eaf9('0x1')][_0x76eaf9('0x14')]();
                }
              )
            : swal(_0xc6c421('0xe'), _0x56267e, 'error'),
          console[_0xc6c421('0x21')](_0x3c4ebd);
      });
  }),
  $(document)['on'](_0x32a830('0x12'), _0x32a830('0x19'), function () {
    var _0x349647 = _0x32a830,
      _0x18d2ff = $(this)[_0x349647('0x3a')](_0x349647('0x0'));
    console[_0x349647('0x21')](orderStore);
    var _0x52179a = orderStore[_0x349647('0x34')](
      (_0x16b596) => _0x16b596['id'] == _0x18d2ff
    );
    buildOrderItems(_0x52179a[0x0]);
  });
var buildOrderItems = function (_0xd75e2) {
  var _0x501333 = _0x32a830,
    _0x2a6742 = $('#orderItemBody');
  $(_0x501333('0x48'))['text']('' + _0xd75e2[_0x501333('0x1f')]),
    $(_0x501333('0x32'))['text'](
      _0xd75e2['ecUser']['firstname'] +
        '\x20' +
        _0xd75e2['ecUser'][_0x501333('0xd')]
    ),
    $(_0x501333('0x41'))[_0x501333('0x22')](
      '' + _0xd75e2[_0x501333('0x5')][_0x501333('0x1d')]
    ),
    $(_0x501333('0x30'))[_0x501333('0x22')](
      '' + _0xd75e2[_0x501333('0x5')][_0x501333('0x13')]
    );
  var _0x62bccb = '';
  _0xd75e2[_0x501333('0x2f')][_0x501333('0x42')]((_0x2b121f, _0x5a4c5f) => {
    var _0x4f2314 = _0x501333;
    console[_0x4f2314('0x21')](_0x2b121f),
      (_0x62bccb +=
        _0x4f2314('0x1b') +
        ++_0x5a4c5f +
        _0x4f2314('0x2c') +
        _0x2b121f[_0x4f2314('0xf')][_0x4f2314('0x9')] +
        '</td>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<td>' +
        _0x2b121f[_0x4f2314('0x36')] +
        _0x4f2314('0x3e') +
        _0x2b121f[_0x4f2314('0xf')][_0x4f2314('0x24')][_0x4f2314('0x1a')]() +
        _0x4f2314('0x3e') +
        (_0x2b121f[_0x4f2314('0xf')][_0x4f2314('0x24')] *
          _0x2b121f[_0x4f2314('0x36')])[_0x4f2314('0x1a')]() +
        _0x4f2314('0x18'));
  }),
    _0x2a6742[_0x501333('0x10')](_0x62bccb),
    $(_0x501333('0x25'))['modal']('show');
};
