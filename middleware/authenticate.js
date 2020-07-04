// load modules
const auth = require("basic-auth");
const bcryptjs = require("bcryptjs");
const { models } = require("../db");
const { User } = models;

// Authenticate User
const authenticateUser = async (req, res, next) => {
  // Holds error messages
  let message = null;
  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);
  // If the user's credentials are available...
  if (credentials) {
    // Attempt to retrieve the user from the data store
    const user = await User.findOne({
      where: {
        emailAddress: credentials.name,
      },
    });
    // If a user was successfully retrieved from the data store...
    if (user) {
      // Use the bcryptjs npm package to compare the user's password with the data store user password
      const authenticated = bcryptjs.compareSync(
        credentials.pass,
        user.password
      );
      // If the passwords match...
      if (authenticated) {
        console.log(
          `Authentication successful for username: ${user.firstName}`
        );
        // Then store the retrieved user object on the request object
        // so any middleware functions that follow this middleware function
        // will have access to the user's information.
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.firstName}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = "Auth header not found";
  }
  // If user authentication failed...
  if (message) {
    console.warn(message);

    res.status(401).json({ message: "Access Denied" });
  } else {
    // Or if user authentication succeeded...
    next();
  }
};

module.exports = { authenticateUser };
