var _0x2558=['ready','val','#spinner','json','#userTbl','DataTable','firstname','lastname','phone','createdAt','format','LLL','hide'];(function(_0x553921,_0x509310){var _0x1aae37=function(_0x28f773){while(--_0x28f773){_0x553921['push'](_0x553921['shift']());}};_0x1aae37(++_0x509310);}(_0x2558,0x152));var _0xc8ea=function(_0x2d8f05,_0x4b81bb){_0x2d8f05=_0x2d8f05-0x0;var _0x4d74cb=_0x2558[_0x2d8f05];return _0x4d74cb;};$(document)[_0xc8ea('0x0')](function(){loadUserTable();});var userTbl,csrfToken=$('#_csrf')[_0xc8ea('0x1')](),spinner=$(_0xc8ea('0x2')),loadUserTable=function(){$['ajax']({'url':'/admin/user','method':'GET','dataType':_0xc8ea('0x3'),'header':{'X-CSRF-TOKEN':csrfToken},'success':function(_0x5d05a4){var _0x17274b=_0x5d05a4['data'];bindTableToData(_0x17274b);}});},bindTableToData=function(_0x59a519){userTbl=$(_0xc8ea('0x4'))[_0xc8ea('0x5')]({'aaData':_0x59a519,'aoColumns':[{'data':'id','render':function(_0x59a519,_0xd29063,_0x1b7391,_0x3a3d3f){return _0x3a3d3f['row']+0x1;}},{'data':'id','render':function(_0x59a519,_0x1b202e,_0x5a04b5,_0x420ecd){return _0x5a04b5[_0xc8ea('0x6')]+'\x20'+_0x5a04b5[_0xc8ea('0x7')];}},{'data':'email'},{'data':_0xc8ea('0x8')},{'data':_0xc8ea('0x9'),'render':function(_0x59a519,_0x349810,_0x2f3cff,_0x17be37){return moment(_0x59a519)[_0xc8ea('0xa')](_0xc8ea('0xb'));}}]}),spinner[_0xc8ea('0xc')]();};