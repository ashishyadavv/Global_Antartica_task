const express = require('express')
const route= express.Router()
const User= require('../models/user')

route.get('/getAll',(req,res,next)=>{
    User.find({}).sort({first_name : 1})
    .exec((err,user)=>{
        if(err) return next(err)
        console.log(user)
        return res.render('contact',
        {title:'All Employee',user}
        )
    })

})

//get request to logout from the system
route.get('/logout',(req,res,next)=>{
    if(req.session){
        req.session.destroy(err=>{
            if(err) return next(err)
            res.redirect('/login')
        })
    }
})

route.post('/getProfile',(req,res,next)=>{
    first_name=req.body.first_name,
    last_name=req.body.last_name,
    Employee_id=req.body.employee_id

    // console.log("user is" + " " + first_name + " " + last_name + " "  + Employee_id)
    User.findById(Employee_id,(err,user)=>{
        res.render('index',
        {title: 'Employee list',
         name:user.first_name + " " + user.last_name,
         email:user.email,
         org: user.org_name ,
         eid:user._id})

    })

})

//get profile
route.get('/profile',(req,res,next)=>{
    if(!req.session.userID){
        return res.redirect('/login')
    }

    User.findById(req.session.userID)
    .exec((err,user)=>{
        if(err) return next(err)
        return res.render('profile',{title: 'profile', name:user.first_name + " " + user.last_name, org_name: user.org_name})
    })
    // return res.render('profile',{title: 'profile'})

})

//to get the login form
route.get('/login',(req,res,next)=>{
    return res.render('login',{title:'Login In!'})

})

route.post('/login',(req,res,next)=>{
    if(req.body.email && req.body.password){
        User.authenticate(req.body.email,req.body.password,(err,user)=>{
            if(err || !user){
                let err= new Error ('Wrong Email or password')
                err.status = 401
                return next(err)
            } 



        req.session.userID=user._id
        return res.redirect('/profile')
        })

        
    }
    else{
        let err = new Error("you need to enter both email and password")
        err.status=401
        return next(err)
    }

})
 

//get request to get the form

route.get('/register',(req,res,next)=>{
    return res.render('signup',{title:'sign up'})
})
//post request to submit the form
route.post('/register',(req,res,next)=>{
    if(req.body.first_name && req.body.password && req.body.email && req.body.org_name){
        var userData= {
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            org_name:req.body.org_name,
            password:req.body.password,
            email:req.body.email
        }
        //before pushing the password into database first call the pre function in mongooose to
        //hash the passowrd and from there we will call the next middleware
        User.create(userData,(err,user)=>{
            if(err) return next(err)
            req.session.userID = user._id
            res.redirect('/profile')

        })
    }
    else{
        let err = new Error ("You need to enter all the details")
        err.status = 400
        return next(err)
    }
})


module.exports = route