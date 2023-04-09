const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");

const app=express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

main().catch(err => console.log(err));




async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');
}

const articleSchema={
    title:String,
    content:String
}

const Article=mongoose.model("Article",articleSchema)




// **********************request targetting all routes*********************************
app.route('/articles')


//getting data from own api
  .get((req,res)=>{
    Article.find({}).then((foundArticles)=>{  //get request
    console.log(foundArticles);
    res.send(foundArticles)
  }) .catch((err)=>{
    console.log(err)
  })
})


.post(function(req, res) {
  const newArticle=new Article({
    title:req.query.title  ,
    content: req.query.content
  })
  
  newArticle.save().then(()=>{   //acknowledge postman that data is sended
   res.send("sended data")
  }).catch((err)=>{
    res.send(err);
  })
})



.delete((req,res)=>{
  Article.deleteMany({}).then(()=>{
    res.send("sucessfully deleted all articles")
  }) .catch((err)=>{
    res.send(err);
  })
})


// **********************request targetting all routes*********************************

app.route("/articles/:articleTitle")

.get((req,res)=>{

Article.findOne({title: req.params.articleTitle}).then((foundArticle)=>{

  if(foundArticle)
  res.send(foundArticle)
  else
  res.send("Title not present in the database")
}). catch((err)=>{
  console.log(err)
})
})

.put((req,res)=>{
Article.replaceOne({title: req.params.articleTitle},
  { title:req.params.title, content:req.params.content },
  {overwrite:true}
  ).then(()=>{
    res.send("article updated")
  }).catch((err)=>{
    res.send(err);})
  })

  .delete((req,res)=>{
    Article.deleteOne({title:req.params.articleTitle}).then(function(){
      res.send("sucessfully deleted")
    }).catch(function(err){
      res.send(err)
    })
  });





app.listen(3000,()=>{
    console.log("server is running");
})