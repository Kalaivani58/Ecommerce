const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');


const jwtSecret = process.env.JWT_SECRET;
// console.log("---secret",jwtSecret);

const authController = {};


authController.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {

        const userExists = await User.findByEmail(email);
        if (userExists) {
            res.status(500).json({ error: `${email} already exists` });
        }

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Fill all the fields' });
        }
        await User.createUser(name, email, password);
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

authController.checkEmail = async (req, res) => {
    const { email } = req.body;
    console.log("---",email);

    try {
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ error: `${error} hi errorr` });
    }
};


authController.verifyPassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.json({ valid: false });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        res.json({ valid: isPasswordValid });
    } catch (error) {
        console.error('Error verifying password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


authController.login = async (req, res) => {
    const { email, password } = req.body;
    console.log('----', email, password);

    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '240h' });
        console.log(token);
        
        res.cookie('token', token, { httpOnly: true, maxAge: 240 * 60 * 60 * 1000 }); 
        // console.log("---",token);   // 240 hours in milliseconds
        res.json({ token:token, name: user.name });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ error: `${error} login errorr` });
    }
};

authController.verifyToken = (req, res) => {
    const token = req.cookies.token;
    // console.log("token",token)
    if (!token) {
        return res.status(401).json({ error: 'Token is missing' });
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        res.json({ username: decoded.name });
    });
};


module.exports = authController;
