const app = require('./app');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();
const PORT = process.env.PORT || 5000;

connectDB(); // ← conectar a MySQL

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
