var _0x2df9=['Verification\x20Successful','Your\x20account\x20has\x20been\x20verified','/user/store','Kindly\x20try\x20again','ajax','get','log','status','#verifiedAcc','show','fadeIn','fadeOut','ready','getElementById','num11','num12','floor','random','value','setAttribute','#changePwdForm','validate','#newPwd','Email\x20is\x20required','Your\x20current\x20password\x20is\x20required','Your\x20new\x20password\x20is\x20required','submit','preventDefault','valid','#btnChangePwd','#spinner','addClass','spinner-grow\x20spinner-grow-sm','#emailupd','val','#currentPwd','POST','json','disabled','removeClass','data','href','/logout','incorrect\x20credentials','Incorrect\x20credentials','#updateInfoForm','Firstname\x20is\x20required','Firstname\x20cannot\x20be\x20less\x20than\x202','Lastname\x20cannot\x20be\x20less\x20than\x202','Phone\x20number\x20is\x20required','Phone\x20must\x20be\x20digits','addMethod','#num11','Captcha\x20failed','#updateBtn','kt-spinner\x20kt-spinner--v2\x20kt-spinner--sm\x20kt-spinner--brand','#lastname','#email','#country','#author','/user/account','reload','Bank\x20name\x20is\x20required','Account\x20number\x20is\x20required','#bankAccountFrm','#saveaccBtn','#bankname','#bkid','/user/bkaccount','location','GET','#accnumber','#walletFrm','Wallet\x20Id\x20is\x20required','#_csrf','#w_id','/user/wallet','lenght','#wallet','wid','click','#verificationBtnSpinner','attr','success','Token\x20Sent\x20to\x20you\x20email','If\x20you\x20don\x27t\x20get\x20it\x20immediately,\x20wait\x20for\x20few\x20seconds\x20before\x20you\x20request\x20for\x20a\x20re-send','hide','#codeverifyFrm','Verification\x20Failed','Account\x20does\x20not\x20exist','error','#getCodeDiv','#verifyCodeBtn','#verifyAccBtn','#token','/account/verifyme/'];(function(_0x19f88c,_0x41a21a){var _0x35adf8=function(_0x2b1e53){while(--_0x2b1e53){_0x19f88c['push'](_0x19f88c['shift']());}};_0x35adf8(++_0x41a21a);}(_0x2df9,0x64));var _0x20f4=function(_0x47b370,_0x59ccc8){_0x47b370=_0x47b370-0x0;var _0x5a1662=_0x2df9[_0x47b370];return _0x5a1662;};'use strict';function confirmVerificationStatus(){$[_0x20f4('0x0')]({'url':'/user/authcheck','method':_0x20f4('0x1'),'dataType':'json','headers':{'X-CSRF-TOKEN':csrfToken},'success':function(_0xb47562){console[_0x20f4('0x2')](_0xb47562[_0x20f4('0x3')]),0x1==_0xb47562[_0x20f4('0x3')]&&($(_0x20f4('0x4'))[_0x20f4('0x5')](_0x20f4('0x6')),$('#getCodeDiv')['hide'](_0x20f4('0x7')));}});}$(document)[_0x20f4('0x8')](function(){loadBankInfo(),generateCaptcha(),loadWalletInfo(),confirmVerificationStatus();});var generateCaptcha=function(){let _0x8c11e=document[_0x20f4('0x9')](_0x20f4('0xa')),_0x25ae72=document['getElementById'](_0x20f4('0xb')),_0x3b40d1=Math[_0x20f4('0xc')](0x64*Math[_0x20f4('0xd')]())+0x1,_0x29178a=Math['floor'](0x64*Math[_0x20f4('0xd')]())+0x1;_0x8c11e['setAttribute'](_0x20f4('0xe'),_0x3b40d1),_0x25ae72[_0x20f4('0xf')]('value',_0x29178a);},changePwdForm=$(_0x20f4('0x10'));changePwdForm[_0x20f4('0x11')]({'rules':{'emailupd':{'required':!0x0},'currentPwd':{'required':!0x0},'newPwd':{'required':!0x0,'minlength':0x5},'verifyPwd':{'equalTo':_0x20f4('0x12')}},'messages':{'emailupd':{'required':_0x20f4('0x13')},'currentPwd':{'required':_0x20f4('0x14')},'newPwd':{'required':_0x20f4('0x15'),'minlength':'Password\x20must\x20not\x20be\x20less\x20than\x205\x20characters'},'verifyPwd':{'equalTo':'Passwords\x20must\x20match'}}}),$(_0x20f4('0x10'))[_0x20f4('0x16')](function(_0x12130b){if(_0x12130b[_0x20f4('0x17')](),changePwdForm[_0x20f4('0x18')]()){var _0x489f94=$(_0x20f4('0x19')),_0xa1909a=$(_0x20f4('0x1a'));_0x489f94['attr']('disabled',!0x0),_0xa1909a[_0x20f4('0x1b')](_0x20f4('0x1c'));var _0x33b8a1=$(_0x20f4('0x1d'))[_0x20f4('0x1e')]();let _0x12130b={'currentPassword':$(_0x20f4('0x1f'))[_0x20f4('0x1e')](),'newPassword':$('#newPwd')[_0x20f4('0x1e')](),'email':_0x33b8a1};$[_0x20f4('0x0')]({'url':'/user/updatepassword','method':_0x20f4('0x20'),'dataType':_0x20f4('0x21'),'data':_0x12130b,'headers':{'X-CSRF-TOKEN':csrfToken},'success':function(_0x12130b){if(_0x489f94['attr'](_0x20f4('0x22'),!0x1),_0xa1909a[_0x20f4('0x23')](_0x20f4('0x1c')),'updated'==_0x12130b[_0x20f4('0x24')])window['location'][_0x20f4('0x25')]=_0x20f4('0x26');else if(_0x20f4('0x27')==_0x12130b[_0x20f4('0x24')])return alert(_0x20f4('0x28')),!0x1;}});}});var updateInfoForm=$(_0x20f4('0x29'));updateInfoForm[_0x20f4('0x11')]({'rules':{'firstname':{'required':!0x0,'minlength':0x2},'lastname':{'required':!0x0,'minlength':0x2},'email':{'required':!0x0,'email':!0x0},'phone':{'required':!0x0,'digits':!0x0},'total1':{'isTotal':!0x0}},'messages':{'firstname':{'required':_0x20f4('0x2a'),'minlength':_0x20f4('0x2b')},'lastname':{'required':'Lastname\x20is\x20required','minlength':_0x20f4('0x2c')},'email':{'required':_0x20f4('0x13'),'email':'Invalid\x20Email'},'telephone':{'required':_0x20f4('0x2d'),'digits':_0x20f4('0x2e')}}}),jQuery['validator'][_0x20f4('0x2f')]('isTotal',function(_0xa0b030){return Number($(_0x20f4('0x30'))[_0x20f4('0x1e')]())+Number($('#num12')[_0x20f4('0x1e')]())===Number(_0xa0b030);},_0x20f4('0x31')),$(_0x20f4('0x29'))['submit'](function(_0x5d2407){_0x5d2407[_0x20f4('0x17')]();var _0x226941=$('#_csrf')[_0x20f4('0x1e')](),_0x20e72b=$(_0x20f4('0x32'));if(updateInfoForm[_0x20f4('0x18')]()){_0x20e72b['addClass'](_0x20f4('0x33'));var _0x38b1bb={'fname':$('#firstname')[_0x20f4('0x1e')](),'lname':$(_0x20f4('0x34'))[_0x20f4('0x1e')](),'email':$(_0x20f4('0x35'))[_0x20f4('0x1e')](),'phone':$('#phone')[_0x20f4('0x1e')](),'country':$(_0x20f4('0x36'))[_0x20f4('0x1e')](),'id':$(_0x20f4('0x37'))[_0x20f4('0x1e')]()};$['ajax']({'url':_0x20f4('0x38'),'method':'POST','dataType':_0x20f4('0x21'),'data':_0x38b1bb,'headers':{'X-CSRF-TOKEN':_0x226941},'success':function(_0x5d2407){_0x20e72b[_0x20f4('0x23')](_0x20f4('0x33')),window['location'][_0x20f4('0x39')]();}});}});var bankAccountForm=$('#bankAccountFrm');bankAccountForm[_0x20f4('0x11')]({'rules':{'bankname':{'required':!0x0},'accnumber':{'required':!0x0,'maxlength':0xb}},'messages':{'bankname':{'required':_0x20f4('0x3a')},'accnumber':{'required':_0x20f4('0x3b')}}}),$(_0x20f4('0x3c'))[_0x20f4('0x16')](function(_0x1942c1){_0x1942c1[_0x20f4('0x17')]();var _0x43735b=$('#_csrf')['val'](),_0x26a074=$(_0x20f4('0x3d'));if(bankAccountForm[_0x20f4('0x18')]()){_0x26a074[_0x20f4('0x1b')](_0x20f4('0x33'));var _0x2df184=$(_0x20f4('0x3e'))['val'](),_0x215a38=$('#accnumber')[_0x20f4('0x1e')](),_0x5f49fe={'id':$(_0x20f4('0x3f'))['val'](),'name':_0x2df184,'number':_0x215a38};$[_0x20f4('0x0')]({'url':_0x20f4('0x40'),'method':'POST','dataType':'json','data':_0x5f49fe,'headers':{'X-CSRF-TOKEN':_0x43735b},'success':function(_0x1942c1){_0x26a074['removeClass'](_0x20f4('0x33')),window[_0x20f4('0x41')][_0x20f4('0x39')]();}});}});var loadBankInfo=function(){$[_0x20f4('0x0')]({'url':'/user/bkaccount','method':_0x20f4('0x42'),'dataType':_0x20f4('0x21'),'headers':{'X-CSRF-TOKEN':csrfToken},'success':function(_0x4f6468){_0x4f6468['data']&&null!=_0x4f6468[_0x20f4('0x24')]&&($(_0x20f4('0x3e'))[_0x20f4('0x1e')](_0x4f6468[_0x20f4('0x24')]['name']),$(_0x20f4('0x43'))[_0x20f4('0x1e')](_0x4f6468[_0x20f4('0x24')]['number']),$('#bkid')['val'](_0x4f6468[_0x20f4('0x24')]['id']));}});},walletFrm=$(_0x20f4('0x44'));walletFrm[_0x20f4('0x11')]({'rules':{'wallet':{'required':!0x0}},'messages':{'wallet':{'required':_0x20f4('0x45')}}}),$('#walletFrm')[_0x20f4('0x16')](function(_0x166362){_0x166362[_0x20f4('0x17')]();var _0x55a136=$(_0x20f4('0x46'))[_0x20f4('0x1e')](),_0x328fbc=$('#saveWalletBtn');if(walletFrm['valid']()){_0x328fbc['addClass']('kt-spinner\x20kt-spinner--v2\x20kt-spinner--sm\x20kt-spinner--brand');var _0x43fd3f=$('#wallet')[_0x20f4('0x1e')](),_0x5aa4e6={'id':$(_0x20f4('0x47'))[_0x20f4('0x1e')](),'wid':_0x43fd3f};$[_0x20f4('0x0')]({'url':_0x20f4('0x48'),'method':_0x20f4('0x20'),'dataType':_0x20f4('0x21'),'data':_0x5aa4e6,'headers':{'X-CSRF-TOKEN':_0x55a136},'success':function(_0x166362){_0x328fbc[_0x20f4('0x23')](_0x20f4('0x33')),window[_0x20f4('0x41')]['reload']();}});}});var loadWalletInfo=function(){$[_0x20f4('0x0')]({'url':_0x20f4('0x48'),'method':'GET','dataType':_0x20f4('0x21'),'headers':{'X-CSRF-TOKEN':csrfToken},'success':function(_0x2c8f89){_0x2c8f89['data']&&0x0!=_0x2c8f89[_0x20f4('0x24')][_0x20f4('0x49')]&&($(_0x20f4('0x4a'))[_0x20f4('0x1e')](_0x2c8f89[_0x20f4('0x24')][_0x20f4('0x4b')]),$(_0x20f4('0x47'))[_0x20f4('0x1e')](_0x2c8f89[_0x20f4('0x24')]['id']));}});};$(document)['on'](_0x20f4('0x4c'),'#sendVerificationBtn',function(){var _0x581346=$(_0x20f4('0x4d'));_0x581346[_0x20f4('0x1b')](_0x20f4('0x1c')),$(this)['attr']('disabled',!0x0),$[_0x20f4('0x0')]({'url':'/account/sendtoken','method':_0x20f4('0x20'),'dataType':_0x20f4('0x21'),'headers':{'X-CSRF-TOKEN':csrfToken},'success':function(_0x2951a0){_0x581346[_0x20f4('0x23')](_0x20f4('0x1c')),$(this)[_0x20f4('0x4e')](_0x20f4('0x22'),!0x1),_0x20f4('0x4f')==_0x2951a0['status']?(swal(_0x20f4('0x50'),_0x20f4('0x51'),_0x20f4('0x4f')),$('#getCodeDiv')[_0x20f4('0x52')](_0x20f4('0x7')),$(_0x20f4('0x53'))['show'](_0x20f4('0x6'))):swal(_0x20f4('0x54'),_0x20f4('0x55'),_0x20f4('0x56'));}});}),$(document)['on']('click','#resendLinkBtn',function(){$(_0x20f4('0x57'))[_0x20f4('0x5')](_0x20f4('0x6')),$(_0x20f4('0x53'))[_0x20f4('0x52')](_0x20f4('0x7'));}),$(document)['on'](_0x20f4('0x4c'),_0x20f4('0x58'),function(){var _0x17bec6=$(_0x20f4('0x59'));_0x17bec6['addClass'](_0x20f4('0x1c')),$(this)[_0x20f4('0x4e')](_0x20f4('0x22'),!0x0);var _0x2a02da=$(_0x20f4('0x5a'))[_0x20f4('0x1e')]();$[_0x20f4('0x0')]({'url':_0x20f4('0x5b')+_0x2a02da,'method':_0x20f4('0x20'),'dataType':_0x20f4('0x21'),'headers':{'X-CSRF-TOKEN':csrfToken},'success':function(_0x2a02da){_0x17bec6['removeClass'](_0x20f4('0x1c')),$(this)['removeAttr']('disabled'),_0x20f4('0x4f')==_0x2a02da[_0x20f4('0x3')]?swal(_0x20f4('0x5c'),_0x20f4('0x5d'),_0x20f4('0x4f'))['then'](_0x17bec6=>{window[_0x20f4('0x41')]=_0x20f4('0x5e');}):swal(_0x20f4('0x54'),_0x20f4('0x5f'),_0x20f4('0x56'));}});});