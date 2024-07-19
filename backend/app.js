require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(cookieParser());
const PORT = 3000;

const categoryController = require('./controllers/categoryController');
const productController = require('./controllers/productController');
const searchController = require('./controllers/searchController'); // Import search controller
const authController = require('./controllers/authController');




// app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/signup', authController.signup);
app.post('/login', authController.login);
app.get('/verifyToken', authController.verifyToken);
app.post('/checkEmail', authController.checkEmail);
app.post('/verifyPassword', authController.verifyPassword); 
app.get('/search', searchController.searchProducts); // Use search controller for search route
app.get("/category_table", categoryController.getCategoryTable);
app.get("/product_table", productController.getProductTable);

app.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: false, sameSite: 'Strict' });
  res.json({ msg: 'Logged out successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  // console.log(`----> ${process.env.DB_PORT}`);
});
