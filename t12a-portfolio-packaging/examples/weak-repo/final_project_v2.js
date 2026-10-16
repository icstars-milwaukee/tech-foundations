// rsvp stuff
const fs = require('fs')
var d = fs.readFileSync('data.csv','utf8').split('\n')
var y=0
for (var i=1;i<d.length;i++){ if(d[i].split(',')[2]=='yes') y++ }
console.log(y)
