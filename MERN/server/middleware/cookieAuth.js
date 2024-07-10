const jwt = require('jsonwebtoken');
const cors = require('cors');

module.exports = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
  };
  cors(corsOptions);
  const token = req.cookies.token;
  try {
    if (token) {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
      next();
    } else {
      throw new Error('No token provided');
    }
  } catch (error) {
    res.clearCookie('token');
    res.status(401).json({ error: 'Unauthorized' });
  }
};
