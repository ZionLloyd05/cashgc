var _0x1622=['#phone','#bkid','#sendVerificationBtn','Verification\x20Failed','#verifyAccBtn','random','incorrect\x20credentials','#author','Wallet\x20Id\x20is\x20required','#verificationBtnSpinner','Password\x20must\x20not\x20be\x20less\x20than\x205\x20characters','Token\x20Sent\x20to\x20you\x20email','Your\x20new\x20password\x20is\x20required','#wallet','then','Passwords\x20must\x20match','num12','/user/store','Captcha\x20failed','floor','validate','#walletFrm','#updateInfoForm','lenght','#resendLinkBtn','#changePwdForm','Verification\x20Successful','fadeIn','If\x20you\x20don\x27t\x20get\x20it\x20immediately,\x20wait\x20for\x20few\x20seconds\x20before\x20you\x20request\x20for\x20a\x20re-send','#token','setAttribute','json','#getCodeDiv','val','Incorrect\x20credentials','disabled','Phone\x20number\x20is\x20required','removeClass','spinner-grow\x20spinner-grow-sm','num11','success','Kindly\x20try\x20again','log','reload','Your\x20current\x20password\x20is\x20required','/user/bkaccount','/user/wallet','href','Firstname\x20is\x20required','data','error','#accnumber','show','GET','submit','status','validator','Firstname\x20cannot\x20be\x20less\x20than\x202','Account\x20number\x20is\x20required','Lastname\x20cannot\x20be\x20less\x20than\x202','#codeverifyFrm','click','preventDefault','location','POST','ready','#_csrf','Bank\x20name\x20is\x20required','Lastname\x20is\x20required','Account\x20does\x20not\x20exist','/user/account','#updateBtn','number','#verifyCodeBtn','fadeOut','#firstname','kt-spinner\x20kt-spinner--v2\x20kt-spinner--sm\x20kt-spinner--brand','#saveWalletBtn','/account/sendtoken','hide','ajax','#btnChangePwd','/logout','addClass','name','removeAttr','#bankAccountFrm','getElementById','#w_id','attr','#bankname','/user/updatepassword','addMethod','#newPwd','updated','valid'];(function(_0x9d4c94,_0x162261){var _0x1cb205=function(_0x4e4270){while(--_0x4e4270){_0x9d4c94['push'](_0x9d4c94['shift']());}};_0x1cb205(++_0x162261);}(_0x1622,0x6c));var _0x1cb2=function(_0x9d4c94,_0x162261){_0x9d4c94=_0x9d4c94-0x0;var _0x1cb205=_0x1622[_0x9d4c94];return _0x1cb205;};var _0xce691e=_0x1cb2;'use strict';function confirmVerificationStatus(){$['ajax']({'url':'/user/authcheck','method':'get','dataType':'json','headers':{'X-CSRF-TOKEN':csrfToken},'success':function(_0x4e4270){var _0x3ee325=_0x1cb2;console[_0x3ee325('0x1e')](_0x4e4270['status']),0x1==_0x4e4270['status']&&($('#verifiedAcc')[_0x3ee325('0x28')](_0x3ee325('0xf')),$('#getCodeDiv')[_0x3ee325('0x43')](_0x3ee325('0x3e')));}});}$(document)[_0xce691e('0x35')](function(){loadBankInfo(),generateCaptcha(),loadWalletInfo(),confirmVerificationStatus();});var generateCaptcha=function(){var _0x48674b=_0xce691e;let _0x4326da=document[_0x48674b('0x4b')](_0x48674b('0x1b')),_0x2007f8=document[_0x48674b('0x4b')](_0x48674b('0x4')),_0x55e522=Math['floor'](0x64*Math[_0x48674b('0x59')]())+0x1,_0x502a73=Math[_0x48674b('0x7')](0x64*Math[_0x48674b('0x59')]())+0x1;_0x4326da[_0x48674b('0x12')]('value',_0x55e522),_0x2007f8[_0x48674b('0x12')]('value',_0x502a73);},changePwdForm=$(_0xce691e('0xd'));changePwdForm[_0xce691e('0x8')]({'rules':{'emailupd':{'required':!0x0},'currentPwd':{'required':!0x0},'newPwd':{'required':!0x0,'minlength':0x5},'verifyPwd':{'equalTo':_0xce691e('0x51')}},'messages':{'emailupd':{'required':'Email\x20is\x20required'},'currentPwd':{'required':_0xce691e('0x20')},'newPwd':{'required':_0xce691e('0x0'),'minlength':_0xce691e('0x5e')},'verifyPwd':{'equalTo':_0xce691e('0x3')}}}),$(_0xce691e('0xd'))[_0xce691e('0x2a')](function(_0x346099){var _0x3e9026=_0xce691e;if(_0x346099[_0x3e9026('0x32')](),changePwdForm[_0x3e9026('0x53')]()){var _0x272227=$(_0x3e9026('0x45')),_0x7c7ddd=$('#spinner');_0x272227[_0x3e9026('0x4d')](_0x3e9026('0x17'),!0x0),_0x7c7ddd['addClass']('spinner-grow\x20spinner-grow-sm');var _0x4b85fd=$('#emailupd')['val']();let _0x5c7c52={'currentPassword':$('#currentPwd')[_0x3e9026('0x15')](),'newPassword':$(_0x3e9026('0x51'))['val'](),'email':_0x4b85fd};$[_0x3e9026('0x44')]({'url':_0x3e9026('0x4f'),'method':'POST','dataType':_0x3e9026('0x13'),'data':_0x5c7c52,'headers':{'X-CSRF-TOKEN':csrfToken},'success':function(_0x19703a){var _0x438489=_0x3e9026;if(_0x272227[_0x438489('0x4d')]('disabled',!0x1),_0x7c7ddd[_0x438489('0x19')](_0x438489('0x1a')),_0x438489('0x52')==_0x19703a[_0x438489('0x25')])window[_0x438489('0x33')][_0x438489('0x23')]=_0x438489('0x46');else{if(_0x438489('0x5a')==_0x19703a[_0x438489('0x25')])return alert(_0x438489('0x16')),!0x1;}}});}});var updateInfoForm=$('#updateInfoForm');updateInfoForm['validate']({'rules':{'firstname':{'required':!0x0,'minlength':0x2},'lastname':{'required':!0x0,'minlength':0x2},'email':{'required':!0x0,'email':!0x0},'phone':{'required':!0x0,'digits':!0x0},'total1':{'isTotal':!0x0}},'messages':{'firstname':{'required':_0xce691e('0x24'),'minlength':_0xce691e('0x2d')},'lastname':{'required':_0xce691e('0x38'),'minlength':_0xce691e('0x2f')},'email':{'required':'Email\x20is\x20required','email':'Invalid\x20Email'},'telephone':{'required':_0xce691e('0x18'),'digits':'Phone\x20must\x20be\x20digits'}}}),jQuery[_0xce691e('0x2c')][_0xce691e('0x50')]('isTotal',function(_0x297eea){var _0x4588af=_0xce691e;return Number($('#num11')[_0x4588af('0x15')]())+Number($('#num12')[_0x4588af('0x15')]())===Number(_0x297eea);},_0xce691e('0x6')),$(_0xce691e('0xa'))[_0xce691e('0x2a')](function(_0x2065ec){var _0x30b0de=_0xce691e;_0x2065ec['preventDefault']();var _0x49bbdf=$(_0x30b0de('0x36'))['val'](),_0xa081b1=$(_0x30b0de('0x3b'));if(updateInfoForm[_0x30b0de('0x53')]()){_0xa081b1[_0x30b0de('0x47')]('kt-spinner\x20kt-spinner--v2\x20kt-spinner--sm\x20kt-spinner--brand');var _0x5ab0df={'fname':$(_0x30b0de('0x3f'))[_0x30b0de('0x15')](),'lname':$('#lastname')['val'](),'email':$('#email')['val'](),'phone':$(_0x30b0de('0x54'))[_0x30b0de('0x15')](),'country':$('#country')['val'](),'id':$(_0x30b0de('0x5b'))[_0x30b0de('0x15')]()};$[_0x30b0de('0x44')]({'url':_0x30b0de('0x3a'),'method':'POST','dataType':_0x30b0de('0x13'),'data':_0x5ab0df,'headers':{'X-CSRF-TOKEN':_0x49bbdf},'success':function(_0x222cc2){var _0x18f8b6=_0x30b0de;_0xa081b1[_0x18f8b6('0x19')](_0x18f8b6('0x40')),window['location'][_0x18f8b6('0x1f')]();}});}});var bankAccountForm=$(_0xce691e('0x4a'));bankAccountForm['validate']({'rules':{'bankname':{'required':!0x0},'accnumber':{'required':!0x0,'maxlength':0xb}},'messages':{'bankname':{'required':_0xce691e('0x37')},'accnumber':{'required':_0xce691e('0x2e')}}}),$(_0xce691e('0x4a'))[_0xce691e('0x2a')](function(_0x4df558){var _0x1d398e=_0xce691e;_0x4df558[_0x1d398e('0x32')]();var _0x2035d6=$(_0x1d398e('0x36'))[_0x1d398e('0x15')](),_0x21475b=$('#saveaccBtn');if(bankAccountForm['valid']()){_0x21475b[_0x1d398e('0x47')](_0x1d398e('0x40'));var _0x429678=$(_0x1d398e('0x4e'))[_0x1d398e('0x15')](),_0x30d6b5=$(_0x1d398e('0x27'))[_0x1d398e('0x15')](),_0x4b6f44={'id':$(_0x1d398e('0x55'))[_0x1d398e('0x15')](),'name':_0x429678,'number':_0x30d6b5};$['ajax']({'url':'/user/bkaccount','method':_0x1d398e('0x34'),'dataType':'json','data':_0x4b6f44,'headers':{'X-CSRF-TOKEN':_0x2035d6},'success':function(_0x41a3d0){var _0x370d79=_0x1d398e;_0x21475b[_0x370d79('0x19')](_0x370d79('0x40')),window['location'][_0x370d79('0x1f')]();}});}});var loadBankInfo=function(){var _0x422d21=_0xce691e;$[_0x422d21('0x44')]({'url':_0x422d21('0x21'),'method':'GET','dataType':_0x422d21('0x13'),'headers':{'X-CSRF-TOKEN':csrfToken},'success':function(_0x280999){var _0x4972de=_0x422d21;_0x280999[_0x4972de('0x25')]&&null!=_0x280999[_0x4972de('0x25')]&&($(_0x4972de('0x4e'))[_0x4972de('0x15')](_0x280999[_0x4972de('0x25')][_0x4972de('0x48')]),$(_0x4972de('0x27'))[_0x4972de('0x15')](_0x280999['data'][_0x4972de('0x3c')]),$(_0x4972de('0x55'))[_0x4972de('0x15')](_0x280999[_0x4972de('0x25')]['id']));}});},walletFrm=$(_0xce691e('0x9'));walletFrm[_0xce691e('0x8')]({'rules':{'wallet':{'required':!0x0}},'messages':{'wallet':{'required':_0xce691e('0x5c')}}}),$(_0xce691e('0x9'))[_0xce691e('0x2a')](function(_0x239c67){var _0x2e737b=_0xce691e;_0x239c67[_0x2e737b('0x32')]();var _0x550291=$(_0x2e737b('0x36'))['val'](),_0x437e2c=$(_0x2e737b('0x41'));if(walletFrm['valid']()){_0x437e2c['addClass']('kt-spinner\x20kt-spinner--v2\x20kt-spinner--sm\x20kt-spinner--brand');var _0x594c7b=$(_0x2e737b('0x1'))['val'](),_0x20c2a5={'id':$(_0x2e737b('0x4c'))[_0x2e737b('0x15')](),'wid':_0x594c7b};$[_0x2e737b('0x44')]({'url':_0x2e737b('0x22'),'method':_0x2e737b('0x34'),'dataType':_0x2e737b('0x13'),'data':_0x20c2a5,'headers':{'X-CSRF-TOKEN':_0x550291},'success':function(_0x16798f){var _0x59dc18=_0x2e737b;_0x437e2c['removeClass'](_0x59dc18('0x40')),window[_0x59dc18('0x33')][_0x59dc18('0x1f')]();}});}});var loadWalletInfo=function(){var _0x1bb4d6=_0xce691e;$[_0x1bb4d6('0x44')]({'url':_0x1bb4d6('0x22'),'method':_0x1bb4d6('0x29'),'dataType':'json','headers':{'X-CSRF-TOKEN':csrfToken},'success':function(_0x522136){var _0x1df890=_0x1bb4d6;_0x522136[_0x1df890('0x25')]&&0x0!=_0x522136[_0x1df890('0x25')][_0x1df890('0xb')]&&($('#wallet')['val'](_0x522136['data']['wid']),$(_0x1df890('0x4c'))[_0x1df890('0x15')](_0x522136[_0x1df890('0x25')]['id']));}});};$(document)['on'](_0xce691e('0x31'),_0xce691e('0x56'),function(){var _0x2f4e5c=_0xce691e,_0x55da7e=$(_0x2f4e5c('0x5d'));_0x55da7e[_0x2f4e5c('0x47')]('spinner-grow\x20spinner-grow-sm'),$(this)['attr']('disabled',!0x0),$[_0x2f4e5c('0x44')]({'url':_0x2f4e5c('0x42'),'method':_0x2f4e5c('0x34'),'dataType':_0x2f4e5c('0x13'),'headers':{'X-CSRF-TOKEN':csrfToken},'success':function(_0x326317){var _0x5e52ae=_0x2f4e5c;_0x55da7e[_0x5e52ae('0x19')](_0x5e52ae('0x1a')),$(this)[_0x5e52ae('0x4d')](_0x5e52ae('0x17'),!0x1),_0x5e52ae('0x1c')==_0x326317[_0x5e52ae('0x2b')]?(swal(_0x5e52ae('0x5f'),_0x5e52ae('0x10'),_0x5e52ae('0x1c')),$('#getCodeDiv')['hide'](_0x5e52ae('0x3e')),$(_0x5e52ae('0x30'))[_0x5e52ae('0x28')](_0x5e52ae('0xf'))):swal(_0x5e52ae('0x57'),_0x5e52ae('0x39'),_0x5e52ae('0x26'));}});}),$(document)['on'](_0xce691e('0x31'),_0xce691e('0xc'),function(){var _0x27c513=_0xce691e;$(_0x27c513('0x14'))[_0x27c513('0x28')](_0x27c513('0xf')),$(_0x27c513('0x30'))[_0x27c513('0x43')]('fadeOut');}),$(document)['on'](_0xce691e('0x31'),_0xce691e('0x3d'),function(){var _0x176002=_0xce691e,_0x74fb05=$(_0x176002('0x58'));_0x74fb05[_0x176002('0x47')](_0x176002('0x1a')),$(this)['attr'](_0x176002('0x17'),!0x0);var _0x3c6584=$(_0x176002('0x11'))[_0x176002('0x15')]();$['ajax']({'url':'/account/verifyme/'+_0x3c6584,'method':_0x176002('0x34'),'dataType':_0x176002('0x13'),'headers':{'X-CSRF-TOKEN':csrfToken},'success':function(_0x1a6db0){var _0xf682ec=_0x176002;_0x74fb05[_0xf682ec('0x19')](_0xf682ec('0x1a')),$(this)[_0xf682ec('0x49')](_0xf682ec('0x17')),'success'==_0x1a6db0[_0xf682ec('0x2b')]?swal(_0xf682ec('0xe'),'Your\x20account\x20has\x20been\x20verified',_0xf682ec('0x1c'))[_0xf682ec('0x2')](_0x12cfa6=>{var _0x22e732=_0xf682ec;window['location']=_0x22e732('0x5');}):swal(_0xf682ec('0x57'),_0xf682ec('0x1d'),_0xf682ec('0x26'));}});});