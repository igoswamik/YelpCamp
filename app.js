const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const catchAsync=require('./utils/catchAsync');
const Campground=require('./models/campground');
const methodOverride=require('method-override')


mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
  console.log("Database Connected!");
});

const app=express();

app.engine('ejs',ejsMate);// we tell express thats the one we wanna use istead the default one
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true})); //it will parse the req body for us
app.use(methodOverride('_method'));


app.get('/',(req,res)=>{
    res.render("home");
})

app.get('/campgrounds',async(req,res)=>{
    const campgrounds=await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
})
app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
})
app.post('/campgrounds', catchAsync(async (req,res,next)=>{
    const campground=new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.get('/campgrounds/:id',catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/show',{campground});
}))
app.get('/campgrounds/:id/edit',catchAsync(async(req,res)=>{
    const campground=await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
}))
app.put('/campgrounds/:id',catchAsync(async(req,res,next)=>{
    const {id}=req.params;
    const campground=await Campground.findByIdAndUpdate(id,req.body.campground,{runValidators:true,new:true});
    //res.send(req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`);
}))
app.delete('/campgrounds/:id', catchAsync(async(req,res)=>{
    const {id}=req.params;
    const campground=await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.use((err,req,res,next)=>{
   res.send("Oh BOY!!!!! Something went wrong");
})

app.listen(3000,()=>{
    console.log("SERVING ON PORT 3000!");
})