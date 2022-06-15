const express = require("express");
const app = express();
const mongoose =require('mongoose');
const _=require("lodash");
app.set("view engine", "ejs");
// setting up mongoose
var items =[];
mongoose.connect("mongodb://localhost:27017/todolistDB");
const itemSchema=new mongoose.Schema({
    name: String,
})
const Item=new mongoose.model("item",itemSchema);
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
function getDefault(){
   
    Item.insertMany(startingItems,(err)=>{
        if(err) console.log("error while adding database starting items");
        else{
            console.log(startingItems);
        }
    })
}

// different routes have different lists of the list collection
const listSchema=new mongoose.Schema({
    name:String,
    items:[itemSchema]
})

const List = new mongoose.model("List",listSchema);

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
            res.render("list",{listTitle : "Today", itemsToAdd: result});
        })
   
});


app.get("/:customListName",(req,res)=>{
    const listName = req.params.customListName
    List.findOne({name:listName},(err,result)=>{
        if(result){
            // show existing list
            res.render("list",{listTitle: result.name, itemsToAdd: result.items})
        }else{
            // create new list
            const list = new List({
                name: listName,
                items:startingItems
            })
            list.save()
            res.redirect("/"+listName);
        }
    })
    
})
// adding item to the database
app.post('/', function(req,res){
    var item = _.capitalize(req.body.nextItem);
    const list = req.body.list;
    const itemToAdd= new Item({
        name:item,
    });
    if(list === "Today"){
        itemToAdd.save();
        res.redirect("/"); 
    }else{
        List.findOne({name: list},(err,foundList)=>{
            foundList.items.push(itemToAdd);
            foundList.save()
            res.redirect("/"+list);
        })
    }
       
})

app.post("/delete", (req,res)=>{
    // console.log(req.body.checkbox);
    const checkedId= req.body.checkbox;
    const list = req.body.listName;
    if(list==="Today"){
        Item.findByIdAndRemove(checkedId,(err)=>{
            if(err) console.log(err);
            else{
                console.log("item removed")
                res.redirect("/");
            }
            
        })
    }else{
        List.findOneAndUpdate({name:list},{$pull: {items: {_id:checkedId}}},(err,foundList)=>{
            if(!err){
                res.redirect("/"+list)
            }
        })
    }

})

app.post("/work", (req,res)=>{
    
    let item = req.body.nextItem;
    workItems.push(item);
    res.redirect("/work");
})
app.listen(port,()=>{
    console.log('server up and running')
})