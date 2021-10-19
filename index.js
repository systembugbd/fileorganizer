const express = require('express');
const path = require('path');

const { organize, help } = require('./src');

if (process.argv[2] === 'organize') {
  organize(process.argv);
}
if (process.argv[2] === 'help') {
  console.log(`%c ${help().run.msg}`, 'color: green');
  process.exit();
}

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.render('index.html');
});
