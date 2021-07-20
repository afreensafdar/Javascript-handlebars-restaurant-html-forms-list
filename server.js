//Express
const express = require('express');
const { check, validationResult } = require("express-validator"); // ??
const app = express();

//const multer = require('multer')
const port = 3000;

// const storage = multer.diskStorage({
//     destination: (req, fileData, next) => {
//         // this is where your uploaded image file will be saved
//         next(null, path.join(__dirname, 'public', 'uploads'))
//     },
//     filename: (req, fileData, next) => {
//         // name the file however you like I'm using a timestamp
//         next(null, new Date().getTime() + path.extname(fileData.originalname))
//     }
// })
//const images = multer({ storage })

// app.post('/restaurants', images.single('image'), (req, res) => {
//     console.log(req.body) // here you can access the text field name of the restaurant req.body.name 
//     console.log(req.file) // this object is the meta data you need to store/process
//     // the uploaded file will be in your `public/uploads` folder (go look!)
//     res.sendStatus(201) // 201 is the response code for successfully creating a resource
// })

//HB
const Handlebars = require("handlebars");
const expressHandlebars = require("express-handlebars");
const {
    allowInsecurePrototypeAccess,
  } = require("@handlebars/allow-prototype-access");

//Models
const Restaurant = require("./models/restaurant");
const Menu = require("./models/menu");
const MenuItem = require("./models/menuItem");
  
//db
const initializeDb = require('./initializeDb');
initializeDb();

//Handlebars Configuration
const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
});
app.engine("handlebars", handlebars);
app.set("view engine", "handlebars");

//serve static files
app.use(express.static("public"));

//body-parsing
app.use(express.json());
app.use(express.urlencoded()); //req.body 

app.get('/web/restaurants', async (req, res) => {
    const restaurants = await Restaurant.findAll();
    res.render('restaurants',{restaurants}) //restaurants view + exposing hb module with restaurants
})

app.get('/web/restaurants/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {
        include: {
            model: Menu,
            include: MenuItem
        }
    });
    console.log('MENUS??', restaurant.Menus)
    res.render('restaurant', {restaurant});
})

app.get("/restaurants/:id", async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: {
        model: Menu,
        include: MenuItem,
      },
    });
    res.json(restaurant);
  });

  //New Routes go here: 
app.get('/new-restaurant-form', (req, res) => {
  res.render('newRestaurantForm');
})

app.post('/new-restaurant', async (req, res) => {
  const newRestaurant = await Restaurant.create(req.body);
  console.log("restaurant",newRestaurant)
  const restaurant = await Restaurant.findByPk(newRestaurant.id);
  console.log("new",restaurant)
  if(restaurant) {
    res.render('restaurant', {restaurant});
     // res.status(201).send('New Restaurant Created Successfully.')
  } else {
      console.log("No restaurant created.")
  }
})



// app.get('/new-menu-form', (req, res) => {
//   res.render('newMenuForm');
// })

app.post('/new-menu', async (req, res) => {
  const newMenu = await Menu.create(req.body);
  const foundMenu = await Menu.findByPk(newMenu.id);
  if(foundMenu) {
      res.status(201).send('New Menu Created Successfully.')
  } else {
      console.log("No menu created.")
  }
})

app.post('/new-item', async (req, res) => {
  const newItem = await MenuItem.create(req.body);
  const foundItem = await MenuItem.findByPk(newMenu.id);
  if(foundItem) {
      res.status(201).send('New Item Created Successfully.')
  } else {
      console.log("No item created.")
  }
})

app.listen(port, () => {
    console.log(`Your app is now listening to port http://localhost:${port}`);
})