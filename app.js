const express = require("express");
const app = express();
const mongoose =require('mongoose');
app.set("view engine", "ejs");
// setting up mongoose
var items =[];
mongoose.connect("mongodb://localhost:27017/todolistDB");
const itemSchema=new mongoose.Schema({
    name: String,
})
const Item=new mongoose.model("item",itemSchema);

function getDefault(){
    const task1=new Item({
        name: "Task1",
    })
    const task2=new Item({
        name: "Task2",
    })
    const task3=new Item({
        name: "Task3",
    })
    const startingItems=[task1,task2,task3];
    Item.insertMany(startingItems,(err)=>{
        if(err) console.log("error while adding database starting items");
        else{
            console.log(startingItems);
        }
    })
}


const body_parser=require("body-parser");
const date =require(__dirname + "/date.js");
app.use(body_parser.urlencoded({ extended: true }));
app.use(express.static("puplic"));
const port =3000;

// var workItems=[];
app.get('/',(req,res)=>{
    let day = date();
    
        Item.find({},(err,result)=>{
            if(result.length===0){
                getDefault();
            }
            res.render("list",{listTitle : day, itemsToAdd: result});
        })
   
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