var _0x49e1=['#spinner','ajax','/admin/user','GET','json','#userTbl','DataTable','row','firstname','lastname','email','phone','format','ready','#_csrf','val'];(function(_0x1d9e66,_0x346b84){var _0x3030b7=function(_0xb614a9){while(--_0xb614a9){_0x1d9e66['push'](_0x1d9e66['shift']());}};_0x3030b7(++_0x346b84);}(_0x49e1,0x6d));var _0x7101=function(_0x519b93,_0x2d6b1a){_0x519b93=_0x519b93-0x0;var _0x9bb681=_0x49e1[_0x519b93];return _0x9bb681;};$(document)[_0x7101('0x0')](function(){loadUserTable();});var userTbl,csrfToken=$(_0x7101('0x1'))[_0x7101('0x2')](),spinner=$(_0x7101('0x3')),loadUserTable=function(){$[_0x7101('0x4')]({'url':_0x7101('0x5'),'method':_0x7101('0x6'),'dataType':_0x7101('0x7'),'header':{'X-CSRF-TOKEN':csrfToken},'success':function(_0x72b702){var _0x3adb19=_0x72b702['data'];bindTableToData(_0x3adb19);}});},bindTableToData=function(_0x472f96){userTbl=$(_0x7101('0x8'))[_0x7101('0x9')]({'aaData':_0x472f96,'aoColumns':[{'data':'id','render':function(_0x472f96,_0x33db3f,_0x364b61,_0x4e5aa8){return _0x4e5aa8[_0x7101('0xa')]+0x1;}},{'data':'id','render':function(_0x472f96,_0x57e74e,_0x3361c7,_0x3e6cff){return _0x3361c7[_0x7101('0xb')]+'\x20'+_0x3361c7[_0x7101('0xc')];}},{'data':_0x7101('0xd')},{'data':_0x7101('0xe')},{'data':'createdAt','render':function(_0x472f96,_0x30bb32,_0x58d560,_0x4950b8){return moment(_0x472f96)[_0x7101('0xf')]('LLL');}}]}),spinner['hide']();};