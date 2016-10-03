
var fs = require('fs');
var util = require('util');
var em_parse = require('parser_email');

var mail = '';
var path_to_email = '1473939620.Vfd01I3038M120792.jinwoo';
//var path_to_email = '1473944050.Vfd01I303dM270241.jinwoo';

stream = fs.ReadStream(path_to_email);
stream.setEncoding('ascii');

stream.on('data', function(data) {
    mail += data;
});

stream.on('close', function () {

  parser = new em_parse(mail);
  parser.on('part', function (type, body) {
    // 내용을 저장
    if (['text/html','text/plain'].indexOf(type['content-type'].value) >= 0) {
      saveContent(type['content-type'].value,type,body)
    }

    // 파일을 저장
    if (type['content-type'].value.match(/^image/i)) {
      saveImg(type,body);
    }
  });
  parser.execute();
});

function saveContent(contType, type, cont) {

  var jbody = cont.replace(/[\n\r\s]*(--.*--[\s\n\r]*)?$/i,"");

  if ( type['content-transfer-encoding'] && 
       type['content-transfer-encoding'].value=='base64') {
    jbody = Buffer.from(jbody, 'base64').toString('utf-8');
  }
}

function saveImg(type, cont) {

  var jbody = cont.replace(/[\n\r\s]*(--.*--[\s\n\r]*)?$/i,"");
  // data buffer 을 그대로 파일로 써주면 이미지가 됨
  fs.writeFile(type['content-type'].name, Buffer.from(jbody,'base64'), function(err) {});
}

