var _0x355b=['ready','#kt_toast_1','#_csrf','val','#spinner','/user/transaction','GET','json','data','forEach','Purchase','Sales','giftCodes','giftCodeCategory','title','code','createdAt','isUsed','Used','Not\x20Used','push','#codeTbl','DataTable','row','\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22input-group\x20input-group-sm\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<input\x20type=\x22text\x22\x20class=\x22form-control\x22\x20value=\x22','\x22\x20id=\x22id_','\x22\x20readonly>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22input-group-append\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20data-clipboard-text=\x22','\x22\x20class=\x22btn\x20btn-primary\x20btnCopy\x22\x20type=\x22button\x22>Copy</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20','isActivated','<span\x20class=\x22kt-badge\x20\x20kt-badge--primary\x20kt-badge--inline\x20kt-badge--pill\x22>Active</span>','date','format','LLL','status','<span\x20class=\x22kt-badge\x20\x20kt-badge--danger\x20kt-badge--inline\x20kt-badge--pill\x22>','</span>','<span\x20class=\x22kt-badge\x20\x20kt-badge--primary\x20kt-badge--inline\x20kt-badge--pill\x22>','type','hide','success','Code\x20Copied','clearSelection','error','Action:','action','Trigger:','trigger'];(function(_0x4ffbbc,_0x2c9935){var _0x31f74b=function(_0x145853){while(--_0x145853){_0x4ffbbc['push'](_0x4ffbbc['shift']());}};_0x31f74b(++_0x2c9935);}(_0x355b,0x1d6));var _0x3a48=function(_0x4c57f5,_0x206353){_0x4c57f5=_0x4c57f5-0x0;var _0x21c230=_0x355b[_0x4c57f5];return _0x21c230;};'use strict';$(document)[_0x3a48('0x0')](function(){loadCodeTable(),$(_0x3a48('0x1'))['toast']({'delay':0xfa0});});var codeTbl,csrfToken=$(_0x3a48('0x2'))[_0x3a48('0x3')](),spinner=$(_0x3a48('0x4')),loadCodeTable=function(){$['ajax']({'url':_0x3a48('0x5'),'method':_0x3a48('0x6'),'dataType':_0x3a48('0x7'),'header':{'X-CSRF-TOKEN':csrfToken},'success':function(_0x3493bc){var _0x5dd521=_0x3493bc[_0x3a48('0x8')],_0x7f9af4=formatData(_0x5dd521);bindTableToData(_0x7f9af4);}});},formatData=function(_0x11e467){var _0xdc3d96=[];return _0x11e467[_0x3a48('0x9')](_0x11e467=>{var _0x2fc7dc='';_0x2fc7dc=0x0==_0x11e467['type']?_0x3a48('0xa'):_0x3a48('0xb'),_0x11e467[_0x3a48('0xc')]['forEach'](_0x11e467=>{var _0xa5fb8a={'title':_0x11e467[_0x3a48('0xd')][_0x3a48('0xe')],'code':_0x11e467[_0x3a48('0xf')],'date':_0x11e467[_0x3a48('0x10')],'isActivated':_0x11e467['isActivated'],'status':0x1==_0x11e467[_0x3a48('0x11')]?_0x3a48('0x12'):_0x3a48('0x13'),'type':_0x2fc7dc};_0xdc3d96[_0x3a48('0x14')](_0xa5fb8a);});}),_0xdc3d96;},bindTableToData=function(_0x52c18e){codeTbl=$(_0x3a48('0x15'))[_0x3a48('0x16')]({'aaData':_0x52c18e,'aoColumns':[{'data':'id','render':function(_0x52c18e,_0x49f2af,_0x1a1e3d,_0x183c3c){return _0x183c3c[_0x3a48('0x17')]+0x1;}},{'data':_0x3a48('0xe')},{'data':'code','render':function(_0x52c18e,_0x5a151b,_0x19999a,_0x3fdb23){return _0x3a48('0x18')+_0x52c18e+_0x3a48('0x19')+_0x3fdb23[_0x3a48('0x17')]+_0x3a48('0x1a')+_0x52c18e+_0x3a48('0x1b');}},{'data':_0x3a48('0x1c'),'render':function(_0x52c18e){return 0x1==_0x52c18e?_0x3a48('0x1d'):'<span\x20class=\x22kt-badge\x20\x20kt-badge--danger\x20kt-badge--inline\x20kt-badge--pill\x22>Inactive</span>';}},{'data':_0x3a48('0x1e'),'render':function(_0x52c18e,_0x260826,_0x5e4b25,_0x4ce89c){return moment(_0x52c18e)[_0x3a48('0x1f')](_0x3a48('0x20'));}},{'data':_0x3a48('0x21'),'render':function(_0x52c18e,_0x421720,_0x385b8d,_0x292df6){return _0x3a48('0x12')==_0x52c18e?_0x3a48('0x22')+_0x52c18e+_0x3a48('0x23'):_0x3a48('0x24')+_0x52c18e+_0x3a48('0x23');}},{'data':_0x3a48('0x25')}]}),spinner[_0x3a48('0x26')]();},clipboard=new ClipboardJS('.btnCopy');clipboard['on'](_0x3a48('0x27'),function(_0x5da4ea){swal(_0x3a48('0x28'),'','success'),_0x5da4ea[_0x3a48('0x29')]();}),clipboard['on'](_0x3a48('0x2a'),function(_0x3685e0){console['error'](_0x3a48('0x2b'),_0x3685e0[_0x3a48('0x2c')]),console[_0x3a48('0x2a')](_0x3a48('0x2d'),_0x3685e0[_0x3a48('0x2e')]);});