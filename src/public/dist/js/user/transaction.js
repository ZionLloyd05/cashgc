var _0x3382=['payment','Paypal','Auto\x20Payout','Bank','Manual\x20Payout','toLocaleString','hide','ready','#_csrf','val','show','ajax','/user/utransaction','GET','json','#transactionTbl','DataTable','data','row','reference','type','Purchase','<span\x20class=\x27kt-badge\x20kt-badge--success\x20kt-badge--inline\x27>Processed</span>'];(function(_0x594c90,_0x4126ad){var _0x17e9be=function(_0x547b0c){while(--_0x547b0c){_0x594c90['push'](_0x594c90['shift']());}};_0x17e9be(++_0x4126ad);}(_0x3382,0x7a));var _0x1fad=function(_0x22585c,_0x139a31){_0x22585c=_0x22585c-0x0;var _0x550c77=_0x3382[_0x22585c];return _0x550c77;};'use strict';$(document)[_0x1fad('0x0')](function(){loadTransactionTable();});var transactionTbl,csrfToken=$(_0x1fad('0x1'))[_0x1fad('0x2')](),spinner=$('#spinner'),loadTransactionTable=function(){spinner[_0x1fad('0x3')](),$[_0x1fad('0x4')]({'url':_0x1fad('0x5'),'method':_0x1fad('0x6'),'dataType':_0x1fad('0x7'),'headers':{'X-CSRF-TOKEN':csrfToken},'success':function(_0x12fe77){bindTableToData(_0x12fe77);}});},bindTableToData=function(_0x377e85){transactionTbl=$(_0x1fad('0x8'))[_0x1fad('0x9')]({'aaData':_0x377e85[_0x1fad('0xa')],'aoColumns':[{'data':'id','render':function(_0x377e85,_0x4902be,_0x4be32b,_0x4fdf31){return _0x4fdf31[_0x1fad('0xb')]+0x1;}},{'data':_0x1fad('0xc')},{'data':_0x1fad('0xd'),'render':function(_0x377e85){return 0x0==_0x377e85?_0x1fad('0xe'):0x1==_0x377e85?'Sales':void 0x0;}},{'data':'status','render':function(_0x377e85,_0x4597ff,_0x481fbf,_0x3a2df6){return 0x0==_0x377e85?_0x1fad('0xf'):0x1==_0x377e85?'<span\x20class=\x27kt-badge\x20kt-badge--danger\x20kt-badge--inline\x27>Failed</span>':0x2==_0x377e85?'<span\x20class=\x27kt-badge\x20kt-badge--warning\x20kt-badge--inline\x27>Pending</span>':void 0x0;}},{'data':_0x1fad('0x10'),'render':function(_0x377e85){return 0x0==_0x377e85?_0x1fad('0x11'):0x1==_0x377e85?_0x1fad('0x12'):0x2==_0x377e85?'Bitcoin':0x3==_0x377e85?_0x1fad('0x13'):0x4==_0x377e85?_0x1fad('0x14'):void 0x0;}},{'data':'amount','render':function(_0x377e85){return _0x377e85[_0x1fad('0x15')]();}}]}),spinner[_0x1fad('0x16')]();};