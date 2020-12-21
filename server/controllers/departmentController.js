const ObjectId = require('mongoose').Types.ObjectId;

const StaffMember = require('../models/StaffMember');
const Faculty = require('../models/Faculty');
const Department = require('../models/Department');
const Course = require('../models/Course');

exports.addDepartment = async function (req, res) {
  try {
    const { facultyCode, depName, HOD } = req.body;

    //all data entered
    if (!facultyCode || !depName)
      return res.send({ error: "Please enter all details" });

    //faculty found? 
    let facultyFound = await Faculty.findOne({ code: facultyCode });
    if (!facultyFound)
      return res.send({ error: "No faculty with this code" });

    facultyFound = await (await Faculty.findOne({ code: facultyCode })).populate('faculty');

    //faculty found? 
    const depFound = await Department.findOne({ faculty: facultyFound._id, name: depName })
    if (depFound)
      return res.send({ error: "Sorry there is another department with this name" });

    let staffMember;
    if (HOD) {
      // staff found? 
      staffMember = (await StaffMember.findOne({ gucId: HOD })).populate('staffMember');
      if (!staffMember)
        return res.send({ error: "No staff member with this ID" });

      //staff is not TA and not HR 
      if (staffMember.role === 'Teaching Assistant' || staffMember.type === 'HR')
        return res.send({ error: "Sorry Head of the department cannot be Teaching Assistant or HR member" });

      if (!(staffMember.faculty.equals(facultyFound._id)))
        return res.send({ error: "Sorry Head of the department should be of the same faculty" });

      const depHOD = await Department.findOne({ HOD: staffMember._id })
      if (depHOD)
        return res.send({ error: "Sorry this staff is Head of another department" });
    } else {
      staffMember = undefined;
    }

    const newDep = {
      faculty: facultyFound,
      name: depName,
      HOD: staffMember,
      Courses: [],
    };

    const depCreated = await Department.create(newDep);
    return res.send({ data: depCreated });
  } catch (err) {
    console.log('~ err', err);
    return res.send({ err: err });
  }
}

exports.updateDepartment = async function (req, res) {
  try {
    const { facultyCode, depName, HOD, newFacultyCode } = req.body;

    //all data entered
    if (!facultyCode || !depName || !(HOD || newFacultyCode))
      return res.send({ error: "Please enter all details" });

    //faculty found? 
    const facultyFound = await Faculty.findOne({ code: facultyCode }).populate('faculty');
    if (!facultyFound)
      return res.send({ error: "No faculty with this name" });

    const depFound = await Department.findOne({ name: depName }).populate('department');
    if (!depFound)
      return res.send({ error: "No department with this name" });

    if (HOD) {// staff found? 
      const staffMember = await (await StaffMember.findOne({ gucId: HOD })).populate('staffMember');
      if (!staffMember)
        return res.send({ error: "No staff member with this ID" });

      //staff is not TA and not HR 
      if (staffMember.role === 'Teaching Assistant' || staffMember.type === 'HR')
        return res.send({ error: "Sorry Head of the department cannot be Teaching Assistant or HR member" });

      //staff of the same faculty?
      if (!(staffMember.faculty.equals(facultyFound._id)))
        return res.send({ error: "Sorry Head of the department should be of the same faculty" });

      const dep = await Department.findOne({ HOD: staffMember._id, })
      if (dep && dep.HOD.name != HOD)
        return res.send({ error: "Sorry this staff is a HOD of another department" });

      depFound.HOD = staffMember;
    }

    if (newFacultyCode) {
      const newFacultyFound = await Faculty.findOne({ code: newFacultyCode }).populate();
      if (!newFacultyFound)
        return res.send({ error: "No faculty with this new name" });

      depFound.faculty = newFacultyFound;
    }

    const updatedDep = await depFound.save();
    return res.send({ data: updatedDep });
  } catch (err) {
    console.log('~ err', err);
    return res.send({ err: err });
  }
}

exports.deleteDepartment = async function (req, res) {
  try {
    const faculty = req.body.faculty;
    const department = req.body.department;

    if (!faculty || !department)
      return res.send({ error: "Please enter all details" });

    const facultyFound = await Faculty.findOne({ code: faculty, });
    if (!facultyFound)
      return res.send({ error: "Sorry no faculty with this name" });

    let depFound = await Department.findOne({ faculty: facultyFound._id, name: department });
    if (!depFound)
      return res.send({ error: "Sorry no department with this name" });


    const courses = await Course.find({ department: depFound._id })
    for (let i = 0; i < courses.length; i++) {
      courses[i].department = undefined;
      await courses[i].save();
    }

    depFound = await Department.findOneAndDelete({ faculty: facultyFound._id, name: department });
    return res.send({ data: "Department deleted successfully" });
  } catch (err) {
    console.log('~ err', err);
    return res.send({ err: err });
  }
}

// ============> HOD functionalities <=================

// to get the staff members of a certain department
exports.getAllStaffMembers = async (req, res) => {
  try {

    let HOD = await StaffMember.findOne({ gucId: req.user.gucId }).populate('HOD');
    let departmentFound = await Department.findOne({
      _id: req.user.department,
    }).populate('department');

    // if there's no department found
    if (!departmentFound) {
      return res
        .status(404)
        .send({
          error: `No department found with this name ${req.user.department}`,
        });
    }
    // if this department has different HOD
    if (!HOD._id.equals(departmentFound.HOD)) {
      return res.send({
        error: "Sorry, you don't have access to view this department",
      });
    }

    // case success
    const staffMembers = await StaffMember.find({
      type: { $in: ["Academic Member"] },
      department: departmentFound._id,
    });

    return res.status(200).send({
      data: staffMembers,
    });
  } catch (err) {
    return res.status(500).send({ err: `Internal Server Error: ${err}` });
  }
};

exports.getStaffMembersPerCourse = async (req, res) => {
  try {
    let HOD = await StaffMember.findOne({ gucId: req.user.gucId }).populate('HOD');
    let departmentFound = await Department.findOne({
      _id: req.user.department,
    }).populate('department');

    // if there's no department found
    if (!departmentFound) {
      return res
        .status(404)
        .send({
          error: `No department found with this id ${req.user.department}`,
        });
    }
    // if this department has different HOD
    if (!HOD._id.equals(departmentFound.HOD)) {
      return res.send({
        error: "Sorry, you don't have access to view this department",
      });
    }

    let courseFound = await Course.findOne({
      department: departmentFound,
      name: req.params.course,
    }).populate();
    // if no course found
    if (!courseFound) {
      return res
        .status(404)
        .send({
          message: `No course found with this name ${req.params.course} under your department`,
        });
    }

    // case success
    const staffMembers = await StaffMember.find({
      type: { $in: ["Academic Member"] },
      department: departmentFound._id,
      courses: courseFound,
    });

    return res.status(200).send({
      data: staffMembers,
    });
  } catch (err) {
    return res.status(500).send({ message: `Internal Server Error: ${err}` });
  }
};

// view day off for all staff members of this department
exports.viewDayOff = async (req, res) => {
  try {
    let HOD = await StaffMember.findOne({ gucId: req.user.gucId }).populate('HOD');
    let departmentFound = await Department.findOne({
      _id: req.user.department,
    }).populate('department');

    // if there's no department found
    if (!departmentFound) {
      return res
        .status(404)
        .send({
          error: `No department found with this id ${req.user.department}`,
        });
    }
    // if this department has different HOD
    if (!HOD._id.equals(departmentFound.HOD)) {
      return res.send({
        error: "Sorry, you don't have access to view this department",
      });
    }

    const staffMembers = await StaffMember.find({
      type: { $in: ["Academic Member"] },
      department: departmentFound._id,
    });
    return res.status(200).send({
      data: staffMembers.map((staffMember) => {
        return {
          gucId: staffMember.gucId,
          name: staffMember.name,
          dayOff: staffMember.dayOff,
        };
      }),
    });
  } catch (err) {
    return res.status(500).send({ err: `Internal Server Error: ${err}` });
  }
};

exports.viewDayOffStaff = async (req, res) => {
  try {
    let HOD = await StaffMember.findOne({ gucId: req.user.gucId }).populate('HOD');
    let departmentFound = await Department.findOne({
      _id: req.user.department,
    }).populate('department');

    // if there's no department found
    if (!departmentFound) {
      return res
        .status(404)
        .send({
          error: `No department found with this id ${req.user.department}`,
        });
    }
    // if this department has different HOD
    if (!HOD._id.equals(departmentFound.HOD)) {
      return res.send({
        error: "Sorry, you don't have access to view this department",
      });
    }

    const staffMember = await StaffMember.findOne({
      type: { $in: ["Academic Member"] },
      gucId: req.params.idStaff,
      department: departmentFound._id,
    });

    // case no staff member found
    if (!staffMember) {
      return res.status(404).send({
        error: `No staff member found with this id under that course`,
      });
    }

    return res.status(200).send({
      data: { gucId: staffMember.gucId, name: staffMember.name, dayOff: staffMember.dayOff },
    });
  } catch (err) {
    return res.status(500).send({ err: `Internal Server Error: ${err}` });
  }
};

// view the course coverage of each course
exports.viewCourseCoverage = async (req, res) => {
  try {
    let HOD = await StaffMember.findOne({ gucId: req.user.gucId }).populate('HOD');
    let departmentFound = await Department.findOne({
      _id: req.user.department,
    }).populate('department');

    // if there's no department found
    if (!departmentFound) {
      return res
        .status(404)
        .send({
          error: `No department found with this id ${req.user.department}`,
        });
    }
    // if this department has different HOD
    if (!HOD._id.equals(departmentFound.HOD)) {
      return res.send({
        error: "Sorry, you don't have access to view this department",
      });
    }

    let courses = await Course.find({ department: departmentFound._id });

    // if no courses found for this department
    if (!courses) {
      return res.send({
        error: "No courses found for this department",
      });
    }

    return res.status(200).send({
      data: courses.map((course) => {
        return {
          course: course.name,
          coverage: course.coverage
        }
      }),
    });
  } catch (err) {
    res.status(500).send({ err: `Internal Server Error: ${err}` });
  }
};
//////////
exports.assignInstructor = async (req, res) => {
  try {
    let instructorId = req.body.gucId;
    let courseName = req.body.name;

    if (!instructorId || !courseName)
      return res.send({ error: "Please enter all the details" });

    let HOD = await StaffMember.findOne({ gucId: req.user.gucId, role: "Course Instructor" }).populate('HOD');
    // if there's no HOD found
    if (!HOD) {
      return res
        .status(404)
        .send({
          error: `No HOD found with this id`,
        });
    }

    let departmentFound = await Department.findOne({
      _id: req.user.department,
      faculty: req.user.faculty
    }).populate('department');

    // if there's no department found
    if (!departmentFound) {
      return res
        .status(404)
        .send({
          error: `No department found with this name ${req.user.department}`,
        });
    }
    // if this department has different HOD
    if (!HOD._id.equals(departmentFound.HOD)) {
      return res.send({
        error: "Sorry, you don't have access to view this department",
      });
    }
    // here check if I have that instructor with that id
    const instructor = await StaffMember.findOne({
      gucId: instructorId,
      department: departmentFound._id,
      type: 'Academic Member',
      role: 'Course Instructor'
    }).populate();

    if (!instructor) {
      return res.send({
        error: `Sorry, there's no instructor with this id ${instructorId} in your department`,
      })
    }

    const course = await Course.findOne({
      department: departmentFound._id,
      name: courseName,
    }).populate();

    if (!course) {
      return res.send({
        error: `Sorry, there's no course with this name ${courseName} in your department`,
      })
    }

    // case instructor doesn't have any courses assigned in this department
    if (instructor.courses.length === 0) {
      instructor.courses.push(course);
      await instructor.save();
    }

    // case he have already assigned courses
    else {
      let repeatedCourse = false;
      for (let i = 0; i < instructor.courses.length; i++) {
        // check that this course is not already assigned to this instructor
        if ((instructor.courses[i]).equals(course._id)) {
          repeatedCourse = true;
          break;
        }
      }

      if (repeatedCourse === true) {
        return res.send({
          error: `Sorry, this course is already assigned to instructor ${instructorId}`,
        })
      }
      else {
        instructor.courses.push(course);
        await instructor.save();
      }
    }

    return res.status(200).send({
      data: {
        msg: `Course assigned to ${instructorId} successfully`,
        course: courseName,
        assigned_To: instructorId,
      }
    });

  } catch (err) {
    res.status(500).send({ err: `Internal Server Error: ${err}` });
  }
}

exports.updateInstructor = async function (req, res) {
  try {
    let instructorId = req.body.gucId;
    let newCourseName = req.body.newName;
    let oldCourseName = req.body.oldName;

    if (!instructorId || !newCourseName || !oldCourseName)
      return res.send({ error: "Please enter all the details" });

    let HOD = await StaffMember.findOne({ gucId: req.user.gucId }).populate('HOD');
    let departmentFound = await Department.findOne({
      _id: req.user.department,
      faculty: req.user.faculty
    }).populate('department');

    // if there's no department found
    if (!departmentFound) {
      return res
        .status(404)
        .send({
          error: `No department found with this name ${req.user.department}`,
        });
    }
    // if this department has different HOD
    if (!HOD._id.equals(departmentFound.HOD)) {
      return res.send({
        error: "Sorry, you don't have access to view this department",
      });
    }
    // here check if I have that instructor with this id
    const instructor = await StaffMember.findOne({
      gucId: instructorId,
      department: departmentFound._id,
      type: 'Academic Member',
      role: 'Course Instructor'
    }).populate();

    if (!instructor) {
      return res.send({
        error: `Sorry, there's no instructor with this id ${instructorId} in your department`,
      })
    }

    const newCourse = await Course.findOne({
      department: departmentFound._id,
      name: newCourseName,
    });

    const oldCourse = await Course.findOne({
      department: departmentFound._id,
      name: oldCourseName,
    });

    if (!newCourse || !oldCourse) {
      return res.send({
        error: `Sorry, there's no course with this name in your department`,
      })
    }

    for (let i = 0; i < instructor.courses.length; i++) {
      if ((instructor.courses[i]).equals(oldCourse._id)) {
        instructor.courses[i] = newCourse;
        await instructor.save();
        break;
      }
    }

    return res.status(200).send({
      data: {
        msg: `Course assigned to ${instructorId} successfully`,
        course: newCourse,
        assigned_To: instructorId,
      }
    });

  } catch (err) {
    res.status(500).send({ message: `Internal Server Error: ${err}` });
  }
}

exports.deleteInstructor = async function (req, res) {
  try {
    let instructorId = req.body.gucId;
    let courseName = req.body.name;

    if (!instructorId || !courseName)
      return res.send({ error: "Please enter all the details" });

    let HOD = await StaffMember.findOne({ gucId: req.user.gucId }).populate('HOD');
    let departmentFound = await Department.findOne({
      _id: req.user.department,
    }).populate('department');

    // if there's no department found
    if (!departmentFound) {
      return res
        .status(404)
        .send({
          error: `No department found with this name ${req.user.department}`,
        });
    }
    // if this department has different HOD
    if (!HOD._id.equals(departmentFound.HOD)) {
      return res.send({
        error: "Sorry, you don't have access to view this department",
      });
    }
    // here check if I have that instructor with that id
    const instructor = await StaffMember.findOne({
      gucId: instructorId,
      department: departmentFound._id,
      type: 'Academic Member',
      role: 'Course Instructor'
    }).populate();

    if (!instructor) {
      return res.send({
        error: `Sorry, there's no instructor with this id ${instructorId} in your department`,
      })
    }

    const course = await Course.findOne({
      department: departmentFound._id,
      name: courseName,
    }).populate();

    if (!course) {
      return res.send({
        error: `Sorry, there's no course with this name ${courseName} in your department`,
      })
    }

    // case instructor doesn't have any courses assigned in this department
    if (instructor.courses.length === 0) {
      return res.send({
        error: `Sorry, there's no course with this name ${courseName} assigned to this instructor`,
      })
    }

    // case he have already assigned courses
    else {
      const found = instructor.courses.some((course) => {
        return course === course._id
      })
      if (found) {
        instructor.courses.splice(course, 1)
        await instructor.save();
      }
    }

    return res.status(200).send({
      data: {
        msg: `Course deleted successfully`,
      }
    });

  } catch (err) {
    res.status(500).send({ message: `Internal Server Error: ${err}` });
  }
}


exports.viewTeachingAssignments = async (req, res) => {
    try {
        let HOD = await StaffMember.findOne({ gucId: req.user.gucId }).populate('HOD');
        let departmentFound = await Department.findOne({
          _id: req.user.department,
        }).populate('department');
    
        // if there's no department found
        if (!departmentFound) {
          return res
            .status(404)
            .send({
              error: `No department found with this id ${req.user.department}`,
            });
        }
        // if this department has different HOD
        if (!HOD._id.equals(departmentFound.HOD)) {
          return res.send({
            error: "Sorry, you don't have access to view this department",
          });
        }

        const teachingAssigned = await StaffMember.find({
            department: departmentFound._id,
        }).populate('courses');

        //console.log(teachingAssigned) // see if populate will return course_schema or not?

        if(!teachingAssigned) {
            return res.send({
                error: `sorry, we couldn't find what you are looking for`,
            });
        }

        const targetCourses = await Course.find({
            department: departmentFound._id,
        }).populate('slots');

        if(!targetCourses) {
            return res.send({
                error: `sorry, we couldn't find the courses that you are looking for`,
            });
        }
        
        return res.status(200).send({
            data: teachingAssigned.map((staff)=>{
                return {
                    name: staff.name,
                    gucId: staff.gucId,
                    courses: staff.courses.map((course) =>{
                        return{
                         courses_assigned:
                             targetCourses.map((targetCourse) =>{
                                if((course.equals(targetCourse._id))){
                                    return {
                                        course_name: targetCourse.name,
                                        course_slots: targetCourse.slots,
                                    }
                                }
                            })
                        }
                    }),
                }    
            })
        });
    } catch (err) {
        res.status(500).send({ err: `Internal Server Error: ${err}` });
    }
}