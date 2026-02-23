import jwt from 'jsonwebtoken';

export const adminLogin = (req, res) => {
  const { email, password } = req.body;
  // ...existing code...
  
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    return res.json({ token });
  }
  res.status(401).json({ message: 'Invalid credentials' });
};
