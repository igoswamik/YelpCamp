const User=require('../models/user');
const passport = require('passport');

module.exports.renderRegister=(req,res)=>{
    res.render('users/register');
}

module.exports.register=async(req,res)=>{
    try{
    const {email,username,password}=req.body;
    const user=new User({email,username});
    const registeredUser=await User.register(user,password);
    req.login(registeredUser,err=>{   //since we want to automatically login user when they succesfully register and req.login is the method provided by passport for this purpose 
        if(err) return next(err);
        req.flash('success','Welcome to Yelp Camp!');
        res.redirect('/campgrounds');
    })
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin= (req,res)=>{
    res.render('users/login');
}

module.exports.login=(req,res)=>{
    req.flash('success','Welcome back!');
    const redirectUrl=req.session.returnTo || '/campgrounds';
    delete req.session.returnTo; //since we dont want this to sit inside our session once we are done using it
    res.redirect(redirectUrl);
}
module.exports.logout=(req,res)=>{
    req.logout();
    req.flash('success','Goodbye!');
    res.redirect('/campgrounds');
}

