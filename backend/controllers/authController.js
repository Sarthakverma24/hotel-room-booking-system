const authService = require('../services/authService');

const authController = {
  login: (req, res) => {
    const { username, password } = req.body;
    
    if (authService.validateCredentials(username, password)) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  }
};

module.exports = authController;