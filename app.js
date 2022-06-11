const express = require("express");
const app = express();
app.set("view engine", "ejs");
const body_parser=require("body-parser");
const date =require(__dirname + "/date.js");
app.use(body_parser.urlencoded({ extended: true }));
app.use(express.static("puplic"));
const port =3000;
var items =['first', 'second','third'];
var workItems=[];
app.get('/',(req,res)=>{
    let day = date();
    res.render("list",{listTitle : day, itemsToAdd: items});
});
app.post('/', function(req,res){
    var item = req.body.nextItem;
    if(req.body.list === "work"){
        workItems.push(item);
        res.redirect("/work")
    }else{
        items.push(item);
        res.redirect('/');
    }
    
    
    
})
app.get("/work", (req,res)=>{
    res.render("list",{listTitle: "work", itemsToAdd: workItems});
})
app.post("/work", (req,res)=>{
    
    let item = req.body.nextItem;
    workItems.push(item);
    res.redirect("/work");
})
app.listen(port,()=>{
    console.log('server up and running')
})