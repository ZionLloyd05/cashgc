var _0x54f2=['Sales','status','<span\x20class=\x27kt-badge\x20kt-badge--success\x20kt-badge--inline\x27>Processed</span>','<span\x20class=\x27kt-badge\x20kt-badge--danger\x20kt-badge--inline\x27>Failed</span>','payment','Paypal','Paystack','Bank','ready','#_csrf','#spinner','onload','onerror','open','cache-control','no-cache,\x20must-revalidate,\x20post-check=0,\x20pre-check=0','max-age=0','expires','setRequestHeader','Tue,\x2001\x20Jan\x201980\x201:00:00\x20GMT','no-cache','send','show','GET','json','#transactionTbl','data','row','reference','Purchase'];(function(_0x97a10a,_0x3e849a){var _0x4e9ac2=function(_0x14d2e3){while(--_0x14d2e3){_0x97a10a['push'](_0x97a10a['shift']());}};_0x4e9ac2(++_0x3e849a);}(_0x54f2,0x170));var _0x5c6b=function(_0x2b9b94,_0x2c9818){_0x2b9b94=_0x2b9b94-0x0;var _0x27a435=_0x54f2[_0x2b9b94];return _0x27a435;};'use strict';$(document)[_0x5c6b('0x0')](function(){loadTransactionTable();});var transactionTbl,csrfToken=$(_0x5c6b('0x1'))['val'](),spinner=$(_0x5c6b('0x2')),onlineCheck=function(){let _0xe1a36d=new XMLHttpRequest();return new Promise((_0x29aaa3,_0x2c1d53)=>{_0xe1a36d[_0x5c6b('0x3')]=()=>{_0x29aaa3(!0x0);},_0xe1a36d[_0x5c6b('0x4')]=()=>{_0x2c1d53(!0x1);},_0xe1a36d[_0x5c6b('0x5')]('GET','https://cors-anywhere.herokuapp.com/https://res.cloudinary.com/zionlloyd/image/upload/v1566997408/Date.png',!0x0),_0xe1a36d['setRequestHeader'](_0x5c6b('0x6'),_0x5c6b('0x7')),_0xe1a36d['setRequestHeader'](_0x5c6b('0x6'),_0x5c6b('0x8')),_0xe1a36d['setRequestHeader'](_0x5c6b('0x9'),'0'),_0xe1a36d[_0x5c6b('0xa')]('expires',_0x5c6b('0xb')),_0xe1a36d[_0x5c6b('0xa')]('pragma',_0x5c6b('0xc')),_0xe1a36d[_0x5c6b('0xd')]();});},loadTransactionTable=function(){spinner[_0x5c6b('0xe')](),$['ajax']({'url':'/user/utransaction','method':_0x5c6b('0xf'),'dataType':_0x5c6b('0x10'),'headers':{'X-CSRF-TOKEN':csrfToken},'success':function(_0x4e5678){bindTableToData(_0x4e5678);}});},bindTableToData=function(_0x6c78da){transactionTbl=$(_0x5c6b('0x11'))['DataTable']({'aaData':_0x6c78da[_0x5c6b('0x12')],'aoColumns':[{'data':'id','render':function(_0x6c78da,_0x9a8484,_0x106d7f,_0x3a7024){return _0x3a7024[_0x5c6b('0x13')]+0x1;}},{'data':_0x5c6b('0x14')},{'data':'type','render':function(_0x6c78da){return 0x0==_0x6c78da?_0x5c6b('0x15'):0x1==_0x6c78da?_0x5c6b('0x16'):void 0x0;}},{'data':_0x5c6b('0x17'),'render':function(_0x6c78da,_0x487ca0,_0x3dc9ad,_0x46fb){return 0x0==_0x6c78da?_0x5c6b('0x18'):0x1==_0x6c78da?_0x5c6b('0x19'):0x2==_0x6c78da?'<span\x20class=\x27kt-badge\x20kt-badge--warning\x20kt-badge--inline\x27>Pending</span>':void 0x0;}},{'data':_0x5c6b('0x1a'),'render':function(_0x6c78da){return 0x0==_0x6c78da?_0x5c6b('0x1b'):0x1==_0x6c78da?_0x5c6b('0x1c'):0x2==_0x6c78da?'Bitcoin':0x3==_0x6c78da?_0x5c6b('0x1d'):void 0x0;}}]}),spinner['hide']();};