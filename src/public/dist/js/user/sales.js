var _0x2eac=['Transfer\x20was\x20successfully\x20posted','Payment\x20will\x20be\x20recieved\x20in\x20few\x20minutes','localrate','splice','ready','val','click','preventDefault','addClass','closest','children','#code','#wrapper','parent','find','#totalPrice2','#nairaAmount','attr','ajax','GET','json','kt-spinner\x20kt-spinner--v2\x20kt-spinner--sm\x20kt-spinner--primary','status','text','The\x20gift\x20code\x20is\x20invalid','Used','The\x20gift\x20code\x20has\x20been\x20used','show','valid','Invalid','Code\x20already\x20included!','Valid','hide','data','giftCodeCategory','buyingPrice','siblings','data-code-pr','data-pr2','toLocaleString','data-status','dirty','push','log','#remove','data-code-id','data-rate','#inputBody','#addMore','stopPropagation','#body','append','\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20id=\x22inputBody\x22\x20class=\x22form-group\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20id=\x22wrapper\x22\x20class=\x22input-group\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<input\x20type=\x22text\x22\x20id=\x22code\x22\x20name=\x22code\x22\x20data-status=\x22saint\x22\x20class=\x22form-control\x22\x20placeholder=\x22Enter\x20Gift\x20Code\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22input-group-append\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20class=\x22btn\x20btn-secondary\x22\x20id=\x22verify\x22\x20type=\x22button\x22><i\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20class=\x22fa\x20fa-plus\x22></i>\x20\x20<span\x20class=\x22kt-hidden-mobile\x22>Redeem</span>\x20\x20\x20</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20class=\x22btn\x20btn-secondary\x22\x20data-code-pr=\x22\x22\x20id=\x22remove\x22\x20type=\x22button\x22><i\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20class=\x22fa\x20fa-times\x22></i></button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20id=\x22infoSpan\x22\x20class=\x22form-text\x20text-muted\x22\x20style=\x22display:none;\x22></span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20','#proceedBtn','length','There\x27s\x20nothing\x20to\x20sell','input[name=\x27m_option_1\x27]:checked','/user/transaction','POST','application/json','then','Transaction\x20Posted\x20Successfully!','success','location','reload','disabled','/user/transfer','stringify','Something\x20went\x20wrong','error'];(function(_0x576a58,_0x4d3e59){var _0x199c6d=function(_0xc13a5c){while(--_0xc13a5c){_0x576a58['push'](_0x576a58['shift']());}};_0x199c6d(++_0x4d3e59);}(_0x2eac,0x11c));var _0x23ee=function(_0x2f6175,_0x3e25a0){_0x2f6175=_0x2f6175-0x0;var _0x352258=_0x2eac[_0x2f6175];return _0x352258;};$(document)[_0x23ee('0x0')](function(){getExchangeRate();var _0x4d7e91=$('#_csrf')[_0x23ee('0x1')](),_0x55ef3e=[],_0x8b7228=[];$(document)['on'](_0x23ee('0x2'),'#verify',function(_0x112552){_0x112552[_0x23ee('0x3')]();let _0x165acb=$(this);_0x165acb[_0x23ee('0x4')]('kt-spinner\x20kt-spinner--v2\x20kt-spinner--sm\x20kt-spinner--primary');var _0x16c589=_0x165acb[_0x23ee('0x5')]('#wrapper')[_0x23ee('0x6')](_0x23ee('0x7')),_0x5a7ed9=_0x165acb['closest'](_0x23ee('0x8'))[_0x23ee('0x9')]()[_0x23ee('0xa')]('#infoSpan'),_0x1a53e1=_0x16c589['val'](),_0x404b81=$(_0x23ee('0xb')),_0x1c132a=Number($(_0x23ee('0xc'))[_0x23ee('0xd')]('data-rate')),_0x2623e8=$(_0x23ee('0xc'));$[_0x23ee('0xe')]({'url':'/user/verify/'+_0x1a53e1,'method':_0x23ee('0xf'),'dataType':_0x23ee('0x10'),'headers':{'X-CSRF-TOKEN':_0x4d7e91},'success':function(_0x4d7e91){if(_0x165acb['removeClass'](_0x23ee('0x11')),'invalid'==_0x4d7e91[_0x23ee('0x12')])_0x5a7ed9[_0x23ee('0x13')](_0x23ee('0x14')),_0x5a7ed9['show']();else if('used'==_0x4d7e91[_0x23ee('0x12')])_0x165acb[_0x23ee('0x13')](_0x23ee('0x15')),_0x5a7ed9[_0x23ee('0x13')](_0x23ee('0x16')),_0x5a7ed9[_0x23ee('0x17')]();else if(_0x23ee('0x18')==_0x4d7e91[_0x23ee('0x12')])if(_0x55ef3e['includes'](_0x1a53e1))_0x165acb['text'](_0x23ee('0x19')),_0x5a7ed9['text'](_0x23ee('0x1a')),_0x5a7ed9[_0x23ee('0x17')]();else{_0x165acb[_0x23ee('0x13')](_0x23ee('0x1b')),_0x5a7ed9[_0x23ee('0x1c')]();var _0x112552=Number(_0x4d7e91[_0x23ee('0x1d')][_0x23ee('0x1e')][_0x23ee('0x1f')]),_0xfa3631=_0x165acb[_0x23ee('0x20')]();_0xfa3631[_0x23ee('0xd')](_0x23ee('0x21'),_0x4d7e91[_0x23ee('0x1d')][_0x23ee('0x1e')]['buyingPrice']),_0xfa3631[_0x23ee('0xd')]('data-code-id',_0x4d7e91[_0x23ee('0x1d')]['id']);var _0x4b71e0=Number(_0x404b81[_0x23ee('0xd')]('data-pr2'))+_0x112552,_0x549646=_0x4b71e0*_0x1c132a;_0x404b81['attr'](_0x23ee('0x22'),_0x4b71e0),_0x404b81[_0x23ee('0x13')](_0x4b71e0['toLocaleString']()),_0x2623e8[_0x23ee('0x13')](_0x549646[_0x23ee('0x23')]()),_0x16c589[_0x23ee('0xd')](_0x23ee('0x24'),_0x23ee('0x25')),_0x55ef3e[_0x23ee('0x26')](_0x1a53e1),_0x8b7228['push'](_0x4d7e91[_0x23ee('0x1d')]['id']);}console['log'](_0x55ef3e),console[_0x23ee('0x27')](_0x8b7228);}});}),$(document)['on'](_0x23ee('0x2'),_0x23ee('0x28'),function(){var _0x4d7e91=$(this),_0x319eec=$(_0x23ee('0xb')),_0x506e14=_0x4d7e91[_0x23ee('0x5')](_0x23ee('0x8'))[_0x23ee('0x6')]('#code'),_0x3e5759=_0x506e14[_0x23ee('0x1')](),_0x247130=Number(_0x4d7e91['attr'](_0x23ee('0x21'))),_0x482aaf=_0x4d7e91['attr'](_0x23ee('0x29')),_0x16113a=Number($(_0x23ee('0xc'))['attr'](_0x23ee('0x2a'))),_0x485b81=$(_0x23ee('0xc')),_0x3ec0d2=Number(_0x319eec[_0x23ee('0xd')](_0x23ee('0x22')))-_0x247130,_0x185ba7=_0x3ec0d2*_0x16113a;_0x319eec['attr'](_0x23ee('0x22'),_0x3ec0d2),_0x319eec[_0x23ee('0x13')](_0x3ec0d2['toLocaleString']()),_0x485b81[_0x23ee('0x13')](_0x185ba7[_0x23ee('0x23')]()),_0x23ee('0x25')===_0x506e14[_0x23ee('0xd')]('data-status')&&(remove(_0x55ef3e,_0x3e5759),remove(_0x8b7228,_0x482aaf)),console[_0x23ee('0x27')](_0x55ef3e),console['log'](_0x8b7228),$(this)['closest'](_0x23ee('0x2b'))['remove']();}),$(document)['on'](_0x23ee('0x2'),_0x23ee('0x2c'),function(_0x4d7e91){_0x4d7e91[_0x23ee('0x2d')]();$(_0x23ee('0x2e'))[_0x23ee('0x2f')](_0x23ee('0x30'));}),$(_0x23ee('0x31'))[_0x23ee('0x2')](function(){var _0x55ef3e=_0x8b7228,_0x2df45e=$(_0x23ee('0xb'))[_0x23ee('0xd')]('data-pr2');if(_0x55ef3e[_0x23ee('0x32')]<0x1)return swal(_0x23ee('0x33'),'','error'),!0x1;var _0x5ec9e7=$(this);_0x5ec9e7[_0x23ee('0x4')](_0x23ee('0x11'));var _0x50eb91=$(_0x23ee('0x34'))[_0x23ee('0x1')]();if('bitcoin'==_0x50eb91){$(_0x23ee('0x31'))[_0x23ee('0xd')]('disabled',!0x0);let _0x8b7228={'status':0x2,'type':0x1,'payment':0x2,'gcodes':_0x55ef3e,'amount':_0x2df45e};fetch(_0x23ee('0x35'),{'method':_0x23ee('0x36'),'body':JSON['stringify'](_0x8b7228),'headers':{'Content-Type':_0x23ee('0x37'),'X-CSRF-TOKEN':_0x4d7e91}})[_0x23ee('0x38')](_0x4d7e91=>_0x4d7e91['json']())[_0x23ee('0x38')](_0x4d7e91=>{_0x5ec9e7['removeClass'](_0x23ee('0x11')),swal(_0x23ee('0x39'),'Processing\x20begins\x20immediately.',_0x23ee('0x3a'))[_0x23ee('0x38')](_0x4d7e91=>{window[_0x23ee('0x3b')][_0x23ee('0x3c')]();});});}else if('bank'===_0x50eb91){$(_0x23ee('0x31'))[_0x23ee('0xd')](_0x23ee('0x3d'),!0x0);let _0x8b7228={'amount':_0x2df45e,'gcodes':_0x55ef3e};fetch(_0x23ee('0x3e'),{'method':_0x23ee('0x36'),'body':JSON[_0x23ee('0x3f')](_0x8b7228),'headers':{'Content-Type':_0x23ee('0x37'),'X-CSRF-TOKEN':_0x4d7e91}})[_0x23ee('0x38')](_0x4d7e91=>_0x4d7e91[_0x23ee('0x10')]())['then'](_0x4d7e91=>{var _0x55ef3e=_0x4d7e91['data'][_0x23ee('0x12')];if('failed'===_0x55ef3e){var _0x8b7228=_0x4d7e91['date'][_0x23ee('0x1d')];swal(_0x23ee('0x40'),_0x8b7228,_0x23ee('0x41'));}else _0x23ee('0x3a')===_0x55ef3e&&swal(_0x23ee('0x42'),_0x23ee('0x43'),_0x23ee('0x3a'))[_0x23ee('0x38')](_0x4d7e91=>{window['location'][_0x23ee('0x3c')]();});});}});});var getExchangeRate=function(){$[_0x23ee('0xe')]({'url':'/user/rate','method':_0x23ee('0xf'),'dataType':'json','header':{'X-CSRF-TOKEN':csrfToken},'success':function(_0x5e8208){'read'===_0x5e8208[_0x23ee('0x12')]&&$(_0x23ee('0xc'))[_0x23ee('0xd')]('data-rate',_0x5e8208[_0x23ee('0x1d')][_0x23ee('0x44')]);}});},remove=function(_0x9a1c11,_0x430384){var _0x2f8ada=_0x9a1c11['indexOf'](_0x430384);_0x9a1c11[_0x23ee('0x45')](_0x2f8ada,0x1);};