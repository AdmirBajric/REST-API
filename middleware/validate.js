const { check, validationResult } = require("express-validator");

const userValidation = () => {
  return [
    check("firstName")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "firstName"'),
    check("lastName")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "lastName"'),
    check("emailAddress")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "emailAddress"')
      .isEmail()
      .withMessage('Please provide a valid email address for "emailAddress"'),
    check("password")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "password"')
      .isLength({ min: 8, max: 20 })
      .withMessage(
        'Please provide a value for "password" that is between 8 and 20 characters in length'
      ),
  ];
};

const courseValidationPut = () => {
  return [
    check("id")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("Please provide value for 'id'"),
    check("title")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("Please provide value for 'title'"),
    check("description")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("Please provide value for 'description'"),
    check("userId")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("Please provide value for 'userId'"),
  ];
};

const courseValidationPost = () => {
  return [
    check("title")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("Please provide value for 'title'"),
    check("description")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("Please provide value for 'description'"),
    check("userId")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage("Please provide value for 'userId'"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = [];
    errors.array().map((err) => errorMessage.push({ [err.param]: err.msg }));

    return res.status(400).json({
      errors: errorMessage,
    });
  } else {
    return next();
  }
};

module.exports = {
  userValidation,
  courseValidationPut,
  courseValidationPost,
  validate,
};
