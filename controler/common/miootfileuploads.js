
var formidable = require('formidable');
var fs = require('fs');
exports.fileuploadform = async function(req, res, next){
     res.writeHead(200, {'Content-Type': 'text/html'});
     res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
     res.write('<input type="file" name="filetoupload"><br>');
     res.write('<input type="submit">');
     res.write('</form>');
     return res.end();
}
exports.fileupload = async function(req, res, next){
     var form = new formidable.IncomingForm();
     form.parse(req, function (err, fields, files) {
       var oldpath = files.filetoupload.path;
       console.log(oldpath);
       var newpath = 'C:/Users/kannan/' + files.filetoupload.name;
       fs.rename(oldpath, newpath, function (err) {
         if (err) throw err;
         res.write('File uploaded and moved!');
         res.end();
       });
  });
}
