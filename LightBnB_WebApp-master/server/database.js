require('dotenv').config();
const properties = require('./json/properties.json');
const users = require('./json/users.json');

const pg = require('pg');
const Client = pg.Client;

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME
};

const client = new Client(config);

//same as app.listen
client.connect(() => {
  console.log("connected to the db");
  ///connected to the db is the ideal situation
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  let userWithEmailQuery = "SELECT * ";
  userWithEmailQuery += "FROM users ";
  userWithEmailQuery += "WHERE email = $1;";

  return client.query(userWithEmailQuery, [email])
    .then(res => {
      if (res.rows) {
        //testing our output
        // console.log(res.rows)
        return res.rows[0];
      } else {
        return null;
      }
    })
    .catch(err => {
      console.log('query error:', err);
    });



  // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  let userWithIdQuery = "SELECT * ";
  userWithIdQuery += "FROM users ";
  userWithIdQuery += "WHERE id = $1;";

  return client.query(userWithIdQuery, [id])
    .then(res => {
      if (res.rows) {
        //testing our output
        // console.log(res.rows)
        return res.rows[0];
      } else {
        return null;
      }
    })
    .catch(err => {
      console.log('query error:', err);
    });
  // return Promise.resolve(users[id]);
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  let addUserQuery = " INSERT INTO users (name, email, password)";
  addUserQuery += " VALUES ($1, $2, $3)";
  addUserQuery += " RETURNING *;";
  const userInfo = [user.name, user.email, user.password];
  return client.query(addUserQuery, userInfo)
    .then(res => {
      return res.rows[0];
    })
    .catch(err => {
      return console.log('query error:', err);
    });
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
let getAllResQuery = 'SELECT reservations.*, properties.*, AVG(property_reviews.rating) AS average_rating'
getAllResQuery += ' FROM properties'
getAllResQuery += ' JOIN reservations ON properties.id = reservations.property_id'
getAllResQuery += ' JOIN property_reviews ON properties.id = property_reviews.property_id'
getAllResQuery += ' WHERE end_date < NOW()::date'
getAllResQuery += ' AND reservations.guest_id = $1'
getAllResQuery += ' GROUP BY reservations.id, properties.id'
getAllResQuery += ' ORDER BY start_date'
getAllResQuery += ' LIMIT $2;'
console.log(getAllResQuery)
return client.query(getAllResQuery, [guest_id, limit])
.then(res => {
  return res.rows;
})
.catch(err => {
  return console.log('query error:', err);
});

// SELECT reservations.*, properties.*, AVG(property_reviews.rating) AS average_rating FROM properties JOIN reservations ON properties.id = reservations.property_id JOIN property_reviews ON properties.id = property_reviews.property_id WHERE end_date < NOW()::date AND reservations.guest_id = $1 GROUP BY reservations.id, properties.id ORDER BY start_date LIMIT $2;

  // return getAllProperties(null, 2);
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  let propQuery = 'Select * ';
  propQuery += 'FROM properties';
  propQuery += ' LIMIT $1';
  console.log(propQuery);
  return client.query(propQuery, [limit])
    .then(res => res.rows).catch(err => console.log(err));
};


exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;
