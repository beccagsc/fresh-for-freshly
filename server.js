const express = require('express')
const fs = require('fs');
const app = express()
const port = 3000

function compareEmails(user1, user2) {
  const user1Email = user1.email.toLowerCase();
  const user2Email = user2.email.toLowerCase();
  let comparison = 0;
  if (user1Email > user2Email) {
    comparison = 1;
  } else if (user1Email < user2Email) {
    comparison = -1;
  }
  return comparison;
}

app.get('/users', (req, res) => {
  fs.readFile('./data/users.json', (err, json) => {
    let allUsers = JSON.parse(json);
    allUsers.sort(compareEmails);
    res.json(allUsers);
  });
});
app.get('/users/:id', (req, res) => {
  const id = Number(req.params.id);
  fs.readFile('./data/users.json', (err, json) => {
    let allUsers = JSON.parse(json);
    for (let user of allUsers) {
      if (user.id === id) {
        res.json(user);
        return;
      }
    }
    res.status(404).send('There is no user with id ' + id);
  });
});
app.get('/subscriptions', (req, res) => {
  res.send('Subscriptions!')
})
app.get('/deliveries', (req, res) => {
  res.send('Deliveries!')
})
app.get('/', (req, res) => {
  res.send('Nothing here bud.')
})

app.listen(port, () => {
  console.log(`Interview app listening at http://localhost:${port}`)
})