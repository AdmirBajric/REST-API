// load modules
const express = require("express");
const authMiddleware = require("../middleware/authenticate");
const { models } = require("../db");
const {
  courseValidationPut,
  courseValidationPost,
  validate,
} = require("../middleware/validate");
const asyncHandler = require("../middleware/asyncHandler");
const { User, Course } = models;
const router = express.Router();

// Route that returns all courses
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: {
        model: User,
        attributes: ["id", "firstName", "lastName", "emailAddress"],
      },
    });
    if (courses.length > 0) {
      res.status(200).json(courses);
    } else {
      res.status(404).json({ message: "No data found" });
    }
  })
);
// Route that returns the required course
router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: {
        model: User,
        attributes: ["id", "firstName", "lastName", "emailAddress"],
      },
    });
    if (course) {
      res.status(200).json({ course });
    } else {
      res.status(404).json({ message: "Course not exist" });
    }
  })
);
// Route that creates a new course
router.post(
  "/courses",
  courseValidationPost(),
  validate,
  authMiddleware.authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = req.body;
      const newCourse = await Course.create(course);
      res.status(201).location(`/courses/${newCourse.dataValues.id}`).end();
    } catch (error) {
      throw error;
    }
  })
);
// Route that updates a single course
router.put(
  "/courses/:id",
  courseValidationPut(),
  validate,
  authMiddleware.authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const currentUser = req.currentUser.dataValues.id;
      const uriCourseId = req.params.id;
      const course = await Course.findByPk(uriCourseId);
      if (course) {
        if (course.dataValues.userId === currentUser) {
          await course.update(req.body);
          res.status(204).end();
        } else {
          res
            .status(403)
            .json({ message: "You are not authorized to make changes" });
        }
      } else {
        res.status(401).json({ message: "No course found. Please try again!" });
      }
    } catch (error) {
      throw error;
    }
  })
);
// Route that delete the single course
router.delete(
  "/courses/:id",
  authMiddleware.authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const currentUser = req.currentUser.dataValues.id;
      const uriCourseId = req.params.id;

      const course = await Course.findByPk(uriCourseId);

      if (course) {
        if (course.dataValues.userId === currentUser) {
          await course.destroy();
          res.status(204).end();
        } else {
          res.status(403).json({
            message: "You are not authorized to delete this course",
          });
        }
      } else {
        res.status(401).json({ message: "No course found. Please try again!" });
      }
    } catch (error) {
      throw error;
    }
  })
);
// Export router module
module.exports = router;
