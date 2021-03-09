const express= require('express')
const app= express()
const route=require('./routes/index')
const mongoose = require('mongoose')
const session = require('express-session')

//TO run the mongodb database server
//create a folder data and run the command
//(mongod --dbpath=./data)

app.use(express.json())
app.use(express.urlencoded({extended:true}))
//create session
app.use(session({
    secret: 'asncncknsjdnfmkcnj',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
  }))
//this is the global middleware which define what data we want
//to show to the user
  app.use((req,res,next)=>{
      res.locals.currentUser = req.session.userID
      next()
  })

app.set('view engine','hbs')
app.use('/',route)



//connecting monogdb
mongoose.connect('mongodb://localhost:27017/employees')
const db=mongoose.connection
db.on('error',(err)=>{
    console.error(err)

})


//Error Handler-middleware
app.use((err,req,res,next)=>{
    res.render('error',{title:'error', message:err.message})
})


app.listen(4444,()=>{
    console.log("server is up at http://localhost:4444")
})