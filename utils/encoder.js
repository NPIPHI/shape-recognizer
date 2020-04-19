fs = require("fs");
let buf = fs.readFileSync("C:/Users/16182/Documents/ShapeRecognizer/models/recognizer/group1-shard1of1.bin")
let base64 = buf.toString('base64');
fs.writeFileSync("C:/Users/16182/Documents/ShapeRecognizer/models/recognizer/binary.json", '{ "bin": "' + base64 + '"}', {encoding: "utf8"})
