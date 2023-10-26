const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const notesRouter = require('./routes/notesRoutes');
const usersRouter = require('./routes/usersRoutes');
const { authenticateToken } = require('./controllers/authController');

dotenv.config({
  path: './config.env',
});

const corsOptions = {
  origin: 'http://localhost:3000',
};

const app = express();
app.use(cors(corsOptions));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(cookieParser());

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);

async function main() {
  try {
    await mongoose.connect(DB);
    console.log('Database connected...');
  } catch (error) {
    console.log(error);
  }
}

main();

app.use('/api/v1/users', usersRouter);
app.use(authenticateToken);
app.use('/api/v1/notes', notesRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
