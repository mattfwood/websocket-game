const shortid = require('shortid');

const newUser = (users) => {
  let validId = false;

  // repeat until ID is valid
  while (validId === false) {
    // generate new id
    const newId = shortid.generate();

    // check if ID already exists in array of users
    const userIndex = users.findIndex(user => user.id === newId);

    if (userIndex === -1) {
      validId = true;
      console.log(newId);
      return newId;
    }
  }
}

module.exports = newUser;
