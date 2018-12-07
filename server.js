const path = require('path');
const express = require('express');
const app = express();


app.set('view engine', 'ejs');

app.use("/public", express.static(__dirname + "/public"));
app.use('/',express.static(__dirname + '/'));


app.get('/', function(req,res){
    console.log("hi");
    res.send(path.join(__dirname + '/index.html'));
    //res.render('index');
})
//hi

app.listen(3000, function (){
	console.log('Example app listening on port 3000!')
})

