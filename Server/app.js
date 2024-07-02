const express = require('express');
const connectDB = require('./config/db')
const adminRoutes = require('./Routes/adminroute.js');
const userRoutes = require('./Routes/useroute.js')
const cors = require('cors');
const deliveryPartnerRoutes = require('./Routes/deliverypartnerRoute.js');





connectDB();
const app = express();
 app.use(express.json())

 app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true // Allow credentials (cookies)
}));

app.use('/admin', adminRoutes);
app.use('/',userRoutes);
app.use('/deliveryPartner',deliveryPartnerRoutes);

const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});