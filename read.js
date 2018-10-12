var fs = require('fs');

fs.readFile('message.txt','utf8', function(err, data) {
  if (err) throw err;
  console.log("12345");
  console.log("12345");
  console.log(data);
});