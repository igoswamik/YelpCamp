const mongoose=require('mongoose');
const Campground=require('../models/campground');
const cities=require('./cities');
const {descriptors,places}=require('./seedHelpers');
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

const sample=array=> array[Math.floor(Math.random()*array.length)];
// 'https://source.unsplash.com/collection/483251'  //we will get different image everytime using this API
const seedDB=async()=>{
    await Campground.deleteMany({});
    for(let i=0;i<200;i++){
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp=new Campground({
            author:'605adc1a6b91cf3fa823750c',
            location:`${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)}, ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse ipsum incidunt, repellendus corporis corrupti harum eum cum recusandae, eveniet distinctio a, saepe voluptatibus! Repudiandae, eos! Ea aliquid iure nihil id?',
            price,
            geometry: { 
              type: 'Point', 
              coordinates: [ 
                cities[random1000].longitude, 
                cities[random1000].latitude 
              ] 
            },
            images:[
                {
                  url: 'https://res.cloudinary.com/igoswamik/image/upload/v1617072063/YelpCamp/gkknrhmejb07hy3at82w.jpg',
                  filename: 'YelpCamp/xgawp9a1d1jwymm3fzei'
                },
                {
                  url: 'https://res.cloudinary.com/igoswamik/image/upload/v1617072628/YelpCamp/zggwh5kbgpfotsagbphh.jpg',
                  filename: 'YelpCamp/zggwh5kbgpfotsagbphh'
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(()=>{
    mongoose.connection.close();
})

