// const { handleError } = require("../utils/handleError");
const mongoose = require('mongoose');
// required models
const StaffMember = require('./../models/StaffMember');

// TODO: Import all the models after db connection
const Course = require('./../models/Course');
const Department = require('./../models/Department');
const Location = require('./../models/Location');
const Faculty = require('./../models/Faculty');

// General Error Messages
const errorMsgs = {
  notFound: (name, id) => {
    return `There is no ${name} with this ${id}`;
  },
  notAssignedTo: (assignmentName, assignee) => {
    return `There are no ${assignmentName} assigned to this ${assignee}`;
  },
  notAssigned: (assignmentName, extraInfo) => {
    return `The ${assignmentName} is not assigned. ${extraInfo ? extraInfo : ''}`;
  },
  notAuthorized: (action) => {
    return `You are not authorized to ${action}`;
  },
  allAssigned: (assignmentName) => {
    return `All the ${assignmentName} are already assigned`;
  },
  alreadyAssigned: (assignmentName) => {
    return `The ${assignmentName} is already assigned`;
  },
};

// Course Instructor Controller
const courseInstructorController = {
  // ==> Functionality 29 <== //
  async courseCoverage(req, res) {
    try {
      const instructor = await StaffMember.findOne({
        gucId: req.params.instructorId,
        type: 'Academic Member',
        role: 'Course Instructor',
      }).populate('courses');

      // Case: instructor not found
      if (!instructor)
        return res.status(404).send({
          message: errorMsgs.notFound('instructor', `id ${req.params.instructorId}`),
        });

      // Case: instructor does not teach any courses
      if (instructor.courses.length === 0)
        return res.status(200).send({
          data: errorMsgs.notAssignedTo('courses', 'instructor'),
        });

      // Case: success
      return res.status(200).send({
        data: instructor.courses.map((course) => {
          return {
            course_name: course.name,
            course_coverage: course.coverage,
          };
        }),
      });
    } catch (err) {
      res.status(500).send({ message: `Internal Server Error: ${err}` });
    }
  },

  // ==> Functionality 30 <== //
  async slotsAssignment(req, res) {
    try {
      const instructor = await StaffMember.findOne({
        gucId: req.params.instructorId,
        type: 'Academic Member',
        role: 'Course Instructor',
      })
        .populate({
          path: 'courses',
          populate: { path: 'slots.location' },
        })
        .populate({
          path: 'courses',
          populate: { path: 'slots.isAssigned' },
        });

      // Case: instructor not found
      if (!instructor)
        return res.status(404).send({
          message: errorMsgs.notFound('instructor', `id ${req.params.instructorId}`),
        });

      // Case: instructor does not have any courses
      if (instructor.courses.length === 0)
        return res.status(200).send({
          data: errorMsgs.notAssignedTo('courses', 'instructor'),
        });

      // Case: success
      return res.status(200).send({
        data: instructor.courses.map((course) => {
          return {
            course_name: course.name,
            course_slots: course.slots
              // Get the slots of the current instructor
              .filter((slot) => slot.isAssigned && `${slot.isAssigned._id}` === `${instructor._id}`)
              // Map them to only send back the day, time, location
              .map(({ day, time, location }) => {
                return {
                  day: day,
                  time: `${time.toLocaleString('en-EG').split(',')[1].trim() || time.getHours() + ':' + time.getMinutes()}`,
                  location: location['location'],
                };
              }),
          };
        }),
      });
    } catch (err) {
      res.status(500).send({ message: `Internal Server Error: ${err}` });
    }
  },

  // ==> Functionality 32 <== //
  async assignSlot(req, res) {
    try {
      // * Get instructor
      const instructor = await StaffMember.findOne({
        gucId: req.params.instructorId,
        type: 'Academic Member',
        role: 'Course Instructor',
      })
        .populate('department')
        .populate({
          path: 'courses',
          populate: { path: 'slots.location' },
        })
        .populate({
          path: 'courses',
          populate: { path: 'slots.isAssigned' },
        });

      // Case: instructor not found
      if (!instructor)
        return res.status(404).send({
          message: errorMsgs.notFound('instructor', `id ${req.params.instructorId}`),
        });

      // Case: instructor does not have any courses
      if (instructor.courses.length === 0)
        return res.status(200).send({
          data: errorMsgs.notAssignedTo('courses', 'instructor'),
        });

      // * Get Course
      const course = await Course.findOne({
        name: req.body.courseName,
      })
        .populate('courseCoordinator')
        .populate('slots.isAssigned');

      // Case: course not found
      if (!course)
        return res.status(404).send({
          message: errorMsgs.notFound('course', `name (${req.body.courseName})`),
        });

      const instructorCourse = instructor.courses.filter((course) => course.name.toLowerCase() === req.body.courseName.toLowerCase());

      // Case: this courseInstructor does not have this course
      if (instructorCourse.length === 0)
        return res.status(404).send({
          message: errorMsgs.notFound('course', `name ${req.body.courseName} assigned to this instructor`),
        });

      const notAssignedSlots = course.slots.filter(({ isAssigned }) => isAssigned === null);

      // Case: all the slots are assigned
      if (notAssignedSlots.length === 0)
        return res.status(200).send({
          message: errorMsgs.allAssigned('slots'),
        });

      const targetSlotIndex = course.slots.findIndex(({ day, time }) => {
        const slotTime = time.toLocaleString('en-EG').split(',')[1].trim().split(' '); // Should have an array with this ['11:45:00', 'AM']
        const targetTime = req.body.slot.time.split(' ');
        targetTime[0] += ':00';
        return day.toLowerCase() === req.body.slot.day.toLowerCase() && slotTime[0] === targetTime[0] && slotTime[1] === targetTime[1];
      });

      // Case: target slot is not found
      if (targetSlotIndex === -1)
        return res.status(200).send({
          message: errorMsgs.notFound('slot', `time ${req.body.slot.time} on ${req.body.slot.day}`),
        });

      // Case: target slot is already assigned
      if (course.slots[targetSlotIndex].isAssigned !== null)
        return res.status(200).send({
          message: errorMsgs.alreadyAssigned('new slot'),
        });

      // * Get TA
      const targetTa = await StaffMember.findOne({
        gucId: req.body.gucId,
        type: 'Academic Member',
        role: 'Teaching Assistant',
        department: instructor.department,
      });

      // Case: TA not found
      if (!targetTa)
        return res.status(404).send({
          message: errorMsgs.notFound('teaching assistant', `id ${req.body.gucId}`),
        });

      // * Case: everything passed
      // Assign the course slot to this TA
      course.slots[targetSlotIndex].isAssigned = targetTa;
      await course.save();

      // Push the course to the TA's courses
      await StaffMember.updateOne(
        { _id: targetTa._id },
        {
          $push: {
            courses: course,
          },
        }
      );
      res.status(200).send({
        data: {
          course: course.name,
          assignedTo: targetTa.name,
          slot: req.body.slot,
        },
      });
    } catch (err) {
      res.status(500).send({ message: `Internal Server Error: ${err}` });
    }
  },

  // ==> Functionality 33 <== //
  async updateSlot(req, res) {
    try {
      // * Get instructor
      const instructor = await StaffMember.findOne({
        gucId: req.params.instructorId,
        type: 'Academic Member',
        role: 'Course Instructor',
      })
        .populate('department')
        .populate({
          path: 'courses',
          populate: { path: 'slots.location' },
        })
        .populate({
          path: 'courses',
          populate: { path: 'slots.isAssigned' },
        });

      // Case: instructor not found
      if (!instructor)
        return res.status(404).send({
          message: errorMsgs.notFound('instructor', `id ${req.params.instructorId}`),
        });

      // Case: instructor does not have any courses
      if (instructor.courses.length === 0)
        return res.status(200).send({
          data: errorMsgs.notAssignedTo('courses', 'instructor'),
        });

      // * Get TA
      const targetTa = await StaffMember.findOne({
        gucId: req.body.gucId,
        type: 'Academic Member',
        role: 'Teaching Assistant',
        department: instructor.department,
      })
        .populate('department')
        .populate({
          path: 'courses',
          populate: { path: 'slots.location' },
        })
        .populate({
          path: 'courses',
          populate: { path: 'slots.isAssigned' },
        });

      // Case: TA not found
      if (!targetTa)
        return res.status(404).send({
          message: errorMsgs.notFound('teaching assistant', `id ${req.body.gucId}`),
        });

      // * Get Course
      const course = await Course.findOne({
        name: req.body.courseName,
      })
        .populate('courseCoordinator')
        .populate('slots.isAssigned');

      // Case: course not found
      if (!course)
        return res.status(404).send({
          message: errorMsgs.notFound('course', `name (${req.body.courseName})`),
        });

      const instructorCourse = instructor.courses.filter((course) => course.name.toLowerCase() === req.body.courseName.toLowerCase());

      // Case: this courseInstructor does not have this course
      if (instructorCourse.length === 0)
        return res.status(404).send({
          message: errorMsgs.notFound('course', `name ${req.body.courseName} assigned to this instructor`),
        });

      const currentSlotIndex = course.slots.findIndex(({ day, time }) => {
        const slotTime = time.toLocaleString('en-EG').split(',')[1].trim().split(' '); // Should have an array with this ['11:45:00', 'AM']
        const currentTime = req.body.slot.time.split(' ');
        currentTime[0] += ':00';
        return day.toLowerCase() === req.body.slot.day.toLowerCase() && slotTime[0] === currentTime[0] && slotTime[1] === currentTime[1];
      });

      // Case: current slot is not found
      if (currentSlotIndex === -1)
        return res.status(200).send({
          message: errorMsgs.notFound('slot', `time ${req.body.slot.time} on ${req.body.slot.day}`),
        });

      // Case: assign the currentSlot to target TA
      if (!req.body.newSlot) {
        if (course.slots[currentSlotIndex].isAssigned === null) res.send(errorMsgs.notAssigned('current slot', 'You can use the "assign slot" route to assign it'));

        const currTa = course.slots[currentSlotIndex].isAssigned;
        course.slots[currentSlotIndex].isAssigned = targetTa;
        await course.save();

        // if target ta does not have this course, add it to the targetTa's courses
        const newCourse = targetTa.courses.findIndex((el) => `${el._id}` === `${course._id}`) === -1;

        if (newCourse)
          await StaffMember.updateOne(
            { _id: targetTa._id },
            {
              $push: {
                courses: course,
              },
            }
          );

        // if current ta does not have another slots in this course, remove it from the currTa's courses
        const stillHaveSlots = course.slots.filter((slot) => slot.isAssigned !== null && slot.isAssigned._id === currTa._id).length > 0;

        if (!stillHaveSlots) {
          const courseIndex = currTa.courses.findIndex((el) => `${el._id}` === `${course._id}`);
          currTa.courses.splice(courseIndex, 1);
          await currTa.save();
        }

        res.status(200).send({
          data: {
            course: course.name,
            oldTa: currTa.name,
            newTa: targetTa.name,
            slot: req.body.slot,
          },
        });
      }
      // Case: assign the newSlot (targetSlot) to target TA
      else {
        const targetSlotIndex = course.slots.findIndex(({ day, time }) => {
          const slotTime = time.toLocaleString('en-EG').split(',')[1].trim().split(' '); // Should have an array with this ['11:45:00', 'AM']
          const targetTime = req.body.newSlot.time.split(' ');
          targetTime[0] += ':00';
          return day.toLowerCase() === req.body.newSlot.day.toLowerCase() && slotTime[0] === targetTime[0] && slotTime[1] === targetTime[1];
        });

        // Case: target slot is not found
        if (targetSlotIndex === -1)
          return res.status(404).send({
            message: errorMsgs.notFound('slot', `time ${req.body.slot.time} on ${req.body.slot.day}`),
          });

        // If currentSlot is assigned to this TA, check that the new slot is available. Remove from oldSlot. Assign to the newSlot

        if (course.slots[currentSlotIndex].isAssigned !== null && `${course.slots[currentSlotIndex].isAssigned._id}` === `${targetTa._id}`) {
          // Case: want to assign the TA to a new slot and remove the old assignment
          if (course.slots[targetSlotIndex].isAssigned === null) {
            course.slots[currentSlotIndex].isAssigned = null;
            course.slots[targetSlotIndex].isAssigned = targetTa;
            await course.save();

            res.status(200).send({
              data: {
                course: course.name,
                assignedTo: targetTa.name,
                oldSlot: req.body.slot,
                newSlot: req.body.newSlot,
              },
            });
          }
          // Case: the target slot is already assigned to another TA
          else return res.status(400).send({ message: errorMsgs.alreadyAssigned('new slot') });
        } else {
          const maleTa = course.slots[currentSlotIndex].isAssigned.gender === 'male';
          res.status(400).send({
            message: `${errorMsgs.alreadyAssigned('current slot')} to another TA. Please enter ${maleTa ? 'his' : 'her'} ID to re-assign ${maleTa ? 'him' : 'her'}.`,
          });
        }
      }
    } catch (err) {
      res.status(500).send({ message: `Internal Server Error: ${err}` });
    }
  },

  // ==> Functionality 34 <== //
  async deleteSlot(req, res) {
    // * Get instructor
    const instructor = await StaffMember.findOne({
      gucId: req.params.instructorId,
      type: 'Academic Member',
      role: 'Course Instructor',
    })
      .populate('department')
      .populate({
        path: 'courses',
        populate: { path: 'slots.location' },
      })
      .populate({
        path: 'courses',
        populate: { path: 'slots.isAssigned' },
      });

    // Case: instructor not found
    if (!instructor)
      return res.status(404).send({
        message: errorMsgs.notFound('instructor', `id ${req.params.instructorId}`),
      });

    // Case: instructor does not have any courses
    if (instructor.courses.length === 0)
      return res.status(200).send({
        data: errorMsgs.notAssignedTo('courses', 'instructor'),
      });

    // * Get TA
    const targetTa = await StaffMember.findOne({
      gucId: req.body.gucId,
      type: 'Academic Member',
      role: 'Teaching Assistant',
      department: instructor.department,
    })
      .populate('department')
      .populate({
        path: 'courses',
        populate: { path: 'slots.location' },
      })
      .populate({
        path: 'courses',
        populate: { path: 'slots.isAssigned' },
      });

    // Case: TA not found
    if (!targetTa)
      return res.status(404).send({
        message: errorMsgs.notFound('teaching assistant', `id ${req.body.gucId}`),
      });

    // * Get Course
    const course = await Course.findOne({
      name: req.body.courseName,
    })
      .populate('courseCoordinator')
      .populate('slots.isAssigned');

    // Case: course not found
    if (!course)
      return res.status(404).send({
        message: errorMsgs.notFound('course', `name (${req.body.courseName})`),
      });

    const instructorCourse = instructor.courses.filter((course) => course.name.toLowerCase() === req.body.courseName.toLowerCase());

    // Case: this courseInstructor does not have this course
    if (instructorCourse.length === 0)
      return res.status(404).send({
        message: errorMsgs.notFound('course', `name ${req.body.courseName} assigned to this instructor`),
      });

    // * Checking the slot cases
    const targetSlotIndex = course.slots.findIndex(({ day, time }) => {
      const slotTime = time.toLocaleString('en-EG').split(',')[1].trim().split(' '); // Should have an array with this ['11:45:00', 'AM']
      const targetTime = req.body.slot.time.split(' ');
      targetTime[0] += ':00';
      return day.toLowerCase() === req.body.slot.day.toLowerCase() && slotTime[0] === targetTime[0] && slotTime[1] === targetTime[1];
    });

    // Case: target slot is not found
    if (targetSlotIndex === -1)
      return res.status(200).send({
        message: errorMsgs.notFound('slot', `time ${req.body.slot.time} on ${req.body.slot.day}`),
      });

    // Case: target slot is not assigned
    if (course.slots[targetSlotIndex].isAssigned === null)
      return res.status(200).send({
        message: errorMsgs.notAssigned('target slot'),
      });

    // * ALl passed
    // Remove the slot assignment
    course.slots[targetSlotIndex].isAssigned = null;
    await course.save();

    // If the TA is not assigned to any slots, remove the course from targetTa's array
    const stillHaveSlots = course.slots.filter((slot) => slot.isAssigned !== null && `${slot.isAssigned._id}` === `${targetTa._id}`).length > 0;

    if (!stillHaveSlots) {
      const courseIndex = targetTa.courses.findIndex((el) => `${el._id}` === `${course._id}`);
      targetTa.courses.splice(courseIndex, 1);
      await targetTa.save();
    }

    res.status(200).send({
      data: {
        course: req.body.courseName,
        slot: req.body.slot,
        assignedTo: null,
      },
    });
  },
};

module.exports.courseInstructorController = courseInstructorController;
