console.log('Node.js基本使用')
var fs = require('fs')
// 异步
fs.readFile('readme.txt', 'utf-8', function (err, data) {
  if (err) {
    console.log('异步', err)
  } else {
    console.log('异步', data)
  }
})
// 同步
var data = fs.readFileSync('readme.txt', 'utf-8')
console.log('同步', data)