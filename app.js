const express = require('express');
const mongoose= require('mongoose');
const Item = require('./models/items');
const app = express();

app.use(express.urlencoded({extended: true}));//this helps to pass the incoming request with url encoded payload 
const mongodb = 'mongodb+srv://jack:Jaygoswam1@cluster0.nicf5a8.mongodb.net/item-database?retryWrites=true&w=majority&appName=Cluster0';

app.set('view engine','ejs');

mongoose.connect(mongodb).then(() => {
    console.log('connected')
    app.listen(3000);
}).catch(err => console.log(err))    


//**********************************************************************************************************************************//
// below code if just using express.js
// app.get('/', (req, res) => {
//     res.sendFile('./views/index.html',{root:__dirname});
// });
//**********************************************************************************************************************************//


//**********************************************************************************************************************************//
// below piece of code to get and set items on a testing route

// app.get('/create-item',(req,res)=>
// {
//     const item = new Item({
//         name:'apple iphone',
//         price:'34000'
//     });
//     item.save().then(result=>res.send(result))
// })

// app.get('/get-items', (req, res) => {
//     Item.find().then(result => res.send(result)).catch(err=>console.log(err))
// })

// app.get('/get-item', (req, res) => {
//     Item.findById('65f505c297dbd78c8600f4e6').then(result => res.send(result)).catch(err => console.log(err))
// })
//****************************************************************************************************************************** */ //

//**********************************************************************************************************************************//
//it was used to render the items on the index page to test the app now insted of this we are redirecting it to get-items page
// app.get('/', (req, res) => {
//     const items = [
//         { name: 'Book', price: 120 },
//         { name: 'Compass', price: 180 },
//         { name: 'Table', price: 150 }
//     ]
//     res.render('index', { items });
// });
//**********************************************************************************************************************************//


app.get('/', (req, res) => {
    res.redirect('/get-items')
});

app.get('/get-items', (req, res) => {
Item.find().then(result => {
    res.render('index', { items:result });
}).catch(err=>console.log(err))
});

app.get('/add-item', (req, res) => {
    res.render('add-item');
});

app.post('/items',(req,res)=>{
    console.log(req.body)
    const item = Item(req.body);
    item.save().then(()=>{
        res.redirect('/get-items')
    }).catch(err=>console.log(err))

})

app.get('/items/:id',(req,res)=>{
    
    const id =req.params.id;
    Item.findById(id).then(result=>{
        console.log('result',result);
        res.render('item-detail',{item:result})

    })
})

app.delete('/items/:id', (req, res) => {

    const id = req.params.id;
    Item.findByIdAndDelete(id).then(result => {
        res.json({redirect: '/get-items'})

    })
})

app.put('/items/:id', (req, res) => {

    const id = req.params.id;
    Item.findByIdAndUpdate(id,req.body).then(result => {
        res.json({msg:'Updated Successfully '})

    })
})

app.use((req, res) => {
    res.render('404');
});
