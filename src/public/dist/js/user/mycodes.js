var _0x4b75=['\x22\x20readonly>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22input-group-append\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<button\x20data-clipboard-text=\x22','\x22\x20class=\x22btn\x20btn-primary\x20btnCopy\x22\x20type=\x22button\x22>Copy</button>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20','date','format','status','<span\x20class=\x22kt-badge\x20\x20kt-badge--danger\x20kt-badge--inline\x20kt-badge--pill\x22>','</span>','<span\x20class=\x22kt-badge\x20\x20kt-badge--primary\x20kt-badge--inline\x20kt-badge--pill\x22>','type','hide','.btnCopy','success','Code\x20Copied','clearSelection','error','Action:','action','Trigger:','trigger','ready','#kt_toast_1','toast','#_csrf','val','#spinner','ajax','/user/transaction','GET','json','data','forEach','Purchase','Sales','title','code','isUsed','Not\x20Used','push','#codeTbl','DataTable','row','\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22input-group\x20input-group-sm\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<input\x20type=\x22text\x22\x20class=\x22form-control\x22\x20value=\x22','\x22\x20id=\x22id_'];(function(_0x42e8b8,_0x52dc26){var _0x2e6d2a=function(_0x3aa5fe){while(--_0x3aa5fe){_0x42e8b8['push'](_0x42e8b8['shift']());}};_0x2e6d2a(++_0x52dc26);}(_0x4b75,0x196));var _0x265a=function(_0x2b9739,_0x5a6d81){_0x2b9739=_0x2b9739-0x0;var _0x4b03fd=_0x4b75[_0x2b9739];return _0x4b03fd;};'use strict';$(document)[_0x265a('0x0')](function(){loadCodeTable(),$(_0x265a('0x1'))[_0x265a('0x2')]({'delay':0xfa0});});var codeTbl,csrfToken=$(_0x265a('0x3'))[_0x265a('0x4')](),spinner=$(_0x265a('0x5')),loadCodeTable=function(){$[_0x265a('0x6')]({'url':_0x265a('0x7'),'method':_0x265a('0x8'),'dataType':_0x265a('0x9'),'header':{'X-CSRF-TOKEN':csrfToken},'success':function(_0x3524ad){var _0x42f0c4=_0x3524ad[_0x265a('0xa')],_0x4765d6=formatData(_0x42f0c4);bindTableToData(_0x4765d6);}});},formatData=function(_0x89af3d){var _0x22cb84=[];return _0x89af3d[_0x265a('0xb')](_0x89af3d=>{var _0xbbcedf='';_0xbbcedf=0x0==_0x89af3d['type']?_0x265a('0xc'):_0x265a('0xd'),_0x89af3d['giftCodes']['forEach'](_0x89af3d=>{var _0x1950d8={'title':_0x89af3d['giftCodeCategory'][_0x265a('0xe')],'code':_0x89af3d[_0x265a('0xf')],'date':_0x89af3d['createdAt'],'status':0x1==_0x89af3d[_0x265a('0x10')]?'Used':_0x265a('0x11'),'type':_0xbbcedf};_0x22cb84[_0x265a('0x12')](_0x1950d8);});}),_0x22cb84;},bindTableToData=function(_0x3bbb75){codeTbl=$(_0x265a('0x13'))[_0x265a('0x14')]({'aaData':_0x3bbb75,'aoColumns':[{'data':'id','render':function(_0x3bbb75,_0xe8bfb1,_0x5089e0,_0x3e666a){return _0x3e666a[_0x265a('0x15')]+0x1;}},{'data':_0x265a('0xe')},{'data':_0x265a('0xf'),'render':function(_0x3bbb75,_0x5de00c,_0x4fa619,_0x5f5062){return _0x265a('0x16')+_0x3bbb75+_0x265a('0x17')+_0x5f5062[_0x265a('0x15')]+_0x265a('0x18')+_0x3bbb75+_0x265a('0x19');}},{'data':_0x265a('0x1a'),'render':function(_0x3bbb75,_0x8c7ff7,_0x4ee1c6,_0x5e1327){return moment(_0x3bbb75)[_0x265a('0x1b')]('LLL');}},{'data':_0x265a('0x1c'),'render':function(_0x3bbb75,_0x2292d9,_0x110b58,_0x426cd2){return'Used'==_0x3bbb75?_0x265a('0x1d')+_0x3bbb75+_0x265a('0x1e'):_0x265a('0x1f')+_0x3bbb75+_0x265a('0x1e');}},{'data':_0x265a('0x20')}]}),spinner[_0x265a('0x21')]();},clipboard=new ClipboardJS(_0x265a('0x22'));clipboard['on'](_0x265a('0x23'),function(_0x264aa6){swal(_0x265a('0x24'),'','success'),_0x264aa6[_0x265a('0x25')]();}),clipboard['on'](_0x265a('0x26'),function(_0xa4e46b){console['error'](_0x265a('0x27'),_0xa4e46b[_0x265a('0x28')]),console[_0x265a('0x26')](_0x265a('0x29'),_0xa4e46b[_0x265a('0x2a')]);});