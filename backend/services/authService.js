const authService = {
  validateCredentials: (username, password) => {
    return username === 'admin' && password === 'password';
  }
};

module.exports = authService;