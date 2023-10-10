const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const notesRouter = require('./routes/notesRoutes');

dotenv.config({
  path: './config.env',
});

const app = express();
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

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

app.use('/api/v1/notes', notesRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
