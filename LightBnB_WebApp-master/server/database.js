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
const getUserWithEmail = function (email) {
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
const getUserWithId = function (id) {
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
const addUser = function (user) {
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
const getAllReservations = function (guest_id, limit = 10) {
  let getAllResQuery = 'SELECT reservations.*, properties.*, AVG(property_reviews.rating) AS average_rating'
  getAllResQuery += ' FROM properties'
  getAllResQuery += ' JOIN reservations ON properties.id = reservations.property_id'
  getAllResQuery += ' JOIN property_reviews ON properties.id = property_reviews.property_id'
  getAllResQuery += ' WHERE end_date < NOW()::date'
  getAllResQuery += ' AND reservations.guest_id = $1'
  getAllResQuery += ' GROUP BY reservations.id, properties.id'
  getAllResQuery += ' ORDER BY start_date'
  getAllResQuery += ' LIMIT $2;'
  // console.log(getAllResQuery)
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
const getAllProperties = function (options, limit = 10) {

  // 1. Setup an array to hold any parameters that may be available for the query.
  const queryParams = [limit]
  // 2. Start the query with all information that comes before the WHERE clause.
  let propQuery = ['Select DISTINCT properties.* ']
  propQuery.push('FROM properties');
  console.log(propQuery)
  // 3. Check if a city has been passed in as an option. Add the city to the params array and create a WHERE clause for the city.
  //city only filled in
  if (options.city && !options.minimum_price_per_night && !options.maximum_price_per_night && !options.minimum_rating) {
    // 4 We can use the length of the array to dynamically get the $n placeholder number. Since this is the first parameter, it will be $1.
    // 5. The % syntax for the LIKE clause must be part of the parameter, not the query.
    queryParams.push("%" + options.city + "%")
    console.log(queryParams)
    propQuery.push(' WHERE properties.city LIKE $2')
    //push to query params - and add the WHERE clause to our propQuery
  }

  //if city and rating is filled in but min/max price are empty
  if(options.city && !options.minimum_price_per_night && !options.maximum_price_per_night && options.minimum_rating ){
    //handle the rating first
    propQuery.push(' JOIN property_reviews ')
      propQuery.push(' ON properties.id = property_reviews.property_id ')
      propQuery.push(' GROUP BY properties.id, property_reviews.id')
      propQuery.push(' HAVING AVG(property_reviews.rating) >= $2 ')
      queryParams.push(options.minimum_rating)
    //handle the city afterwards
      queryParams.push("%" + options.city + "%")
      console.log(queryParams)
      propQuery.push(' WHERE properties.city LIKE $3')
  }

  //if options.city and both min and max price are filled out
  if (options.city && options.minimum_price_per_night && options.maximum_price_per_night && !options.minimum_rating) {
      queryParams.push("%" + options.city + "%")
      console.log(queryParams)
      propQuery.push(' WHERE properties.city LIKE $2')

      queryParams.push(options.minimum_price_per_night * 100, options.maximum_price_per_night * 100)
      console.log(queryParams)
      
      // 6. Add any query that comes after the WHERE clause.
      propQuery.push(' AND properties.cost_per_night > $3 AND properties.cost_per_night < $4 ')
    }

  //if price is only filled in
  if (!options.city && options.minimum_price_per_night && options.maximum_price_per_night && !options.minimum_rating) {
    queryParams.push(options.minimum_price_per_night * 100, options.maximum_price_per_night * 100)
    console.log(queryParams)
    
    // 6. Add any query that comes after the WHERE clause.
    propQuery.push(' AND properties.cost_per_night > $2 AND properties.cost_per_night < $3 ')
  }

    //if rating is only filled in
    if (!options.city && !options.minimum_price_per_night && !options.maximum_price_per_night && options.minimum_rating) {
      propQuery.push(' JOIN property_reviews ')
      propQuery.push(' ON properties.id = property_reviews.property_id ')
      propQuery.push(' GROUP BY properties.id, property_reviews.id')
      propQuery.push(' HAVING AVG(property_reviews.rating) >= $2 ')
      queryParams.push(options.minimum_rating)
    }


  //if everything is provided 
  if (options.city && options.minimum_price_per_night && options.maximum_price_per_night && options.minimum_rating) {
      propQuery.push(' JOIN property_reviews ')
      propQuery.push(' ON properties.id = property_reviews.property_id ')
      propQuery.push(' GROUP BY properties.id, property_reviews.id')
      propQuery.push(' HAVING AVG(property_reviews.rating) >= $2 ')
      queryParams.push(options.minimum_rating)
      console.log(queryParams)
      propQuery.push(' AND properties.city LIKE $3')
      queryParams.push("%" + options.city + "%")
      queryParams.push(options.minimum_price_per_night * 100, options.maximum_price_per_night * 100)
      console.log(queryParams)
      propQuery.push(' AND properties.cost_per_night > $4 AND properties.cost_per_night < $5 ')
      console.log(queryParams)
    }

//     Select * FROM properties JOIN property_reviews  ON properties.id = property_reviews.property_id  GROUP BY properties.id, property_reviews.id HAVING AVG(property_reviews.rating) >= $2  AND properties.city LIKE $3 AND properties.cost_per_night > $4 AND properties.cost_per_night < $5  LIMIT $1
// { error: invalid input syntax for type numeric: "%Vancouver%"

  // Complete this query to allow the following 3 filters:

  // if an owner_id is passed in, only return properties belonging to that owner.
  // if a minimum_price_per_night and a maximum_price_per_night, only return properties within that price range.
  // if a minimum_rating is passed in, only return properties with a rating equal to or higher than that.
  // Remember that all of these may be passed in at the same time so they all need to work together. You will need to use AND for every filter after the first one. Also, none of these might be passed in, so the query still needs to work without a WHERE clause.

  //limit is the last thing to be appended if still applicable?
  propQuery.push(' LIMIT $1');
  //at this point join all the query strings in propQuery array together to make our final query
  propQuery = propQuery.join('')
  // 7. Console log everything just to make sure we've done it right.
  console.log(propQuery);
  // 8. Run the query.
  return client.query(propQuery, queryParams)
    .then(res => {
      // console.log(res.rows)
      return res.rows
    }).catch(err => console.log(err));
};


exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};
exports.addProperty = addProperty;
