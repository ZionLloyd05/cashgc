var _0x19c2=['format','LLL','status','Used','</span>','<span\x20class=\x22kt-badge\x20\x20kt-badge--primary\x20kt-badge--inline\x20kt-badge--pill\x22>','type','hide','addEventListener','target','classList','contains','btnCopy','parentNode','getAttribute','getElementById','execCommand','show','ready','#kt_toast_1','toast','#_csrf','val','#spinner','ajax','/user/transaction','data','forEach','Purchase','Sales','giftCodes','title','createdAt','Not\x20Used','log','#codeTbl','code','\x22\x20id=\x22id_','\x22\x20readonly>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22input-group-append\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20class=\x22btn\x20btn-primary\x20btnCopy\x22\x20type=\x22button\x22\x20id=\x22btnCopy\x22>Copy</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20','date'];(function(_0x53d951,_0x1fc781){var _0x296c1d=function(_0x15aa19){while(--_0x15aa19){_0x53d951['push'](_0x53d951['shift']());}};_0x296c1d(++_0x1fc781);}(_0x19c2,0x17a));var _0x3481=function(_0x462c24,_0x1f95f1){_0x462c24=_0x462c24-0x0;var _0x558206=_0x19c2[_0x462c24];return _0x558206;};'use strict';$(document)[_0x3481('0x0')](function(){loadCodeTable(),$(_0x3481('0x1'))[_0x3481('0x2')]({'delay':0xfa0});});var codeTbl,csrfToken=$(_0x3481('0x3'))[_0x3481('0x4')](),spinner=$(_0x3481('0x5')),loadCodeTable=function(){$[_0x3481('0x6')]({'url':_0x3481('0x7'),'method':'GET','dataType':'json','header':{'X-CSRF-TOKEN':csrfToken},'success':function(_0x559682){var _0x1155fe=_0x559682[_0x3481('0x8')],_0x361577=formatData(_0x1155fe);bindTableToData(_0x361577);}});},formatData=function(_0x33daa8){var _0xf32c71=[];return _0x33daa8[_0x3481('0x9')](_0x33daa8=>{var _0x56b31c='';_0x56b31c=0x0==_0x33daa8['type']?_0x3481('0xa'):_0x3481('0xb'),_0x33daa8[_0x3481('0xc')]['forEach'](_0x33daa8=>{var _0x2ae575={'title':_0x33daa8['giftCodeCategory'][_0x3481('0xd')],'code':_0x33daa8['code'],'date':_0x33daa8[_0x3481('0xe')],'status':0x1==_0x33daa8['isUsed']?'Used':_0x3481('0xf'),'type':_0x56b31c};_0xf32c71['push'](_0x2ae575);});}),console[_0x3481('0x10')](_0xf32c71),_0xf32c71;},bindTableToData=function(_0x133881){codeTbl=$(_0x3481('0x11'))['DataTable']({'aaData':_0x133881,'aoColumns':[{'data':'id','render':function(_0x133881,_0x24f11e,_0x6db4d8,_0x109638){return _0x109638['row']+0x1;}},{'data':'title'},{'data':_0x3481('0x12'),'render':function(_0x133881,_0x1209ba,_0x2a6423,_0x1beef6){return'\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22input-group\x20input-group-sm\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<input\x20type=\x22text\x22\x20class=\x22form-control\x22\x20value=\x22'+_0x133881+_0x3481('0x13')+_0x1beef6['row']+_0x3481('0x14');}},{'data':_0x3481('0x15'),'render':function(_0x133881,_0xd96bd7,_0x30125e,_0x120306){return moment(_0x133881)[_0x3481('0x16')](_0x3481('0x17'));}},{'data':_0x3481('0x18'),'render':function(_0x133881,_0x15d840,_0x4ecabf,_0x347de4){return _0x3481('0x19')==_0x133881?'<span\x20class=\x22kt-badge\x20\x20kt-badge--danger\x20kt-badge--inline\x20kt-badge--pill\x22>'+_0x133881+_0x3481('0x1a'):_0x3481('0x1b')+_0x133881+_0x3481('0x1a');}},{'data':_0x3481('0x1c')}]}),spinner[_0x3481('0x1d')]();};document[_0x3481('0x1e')]('click',function(_0x2ef2d0){if(_0x2ef2d0[_0x3481('0x1f')][_0x3481('0x20')][_0x3481('0x21')](_0x3481('0x22'))){var _0xdae5ea=_0x2ef2d0['target'][_0x3481('0x23')][_0x3481('0x23')]['children'][0x0][_0x3481('0x24')]('id');document[_0x3481('0x25')](_0xdae5ea)['select'](),document[_0x3481('0x26')]('copy'),$(_0x3481('0x1'))[_0x3481('0x2')](_0x3481('0x27'));}},!0x1);