# milestone-1-team51
- To launch the server: npm /server/index.js
- The server is listening to port 5000
- routes: 

### 1. 
Functionality: add a room to the system
Route: /locations/createRoom
Request type: POST
Request body: 

```
{
    "type": "office",
     "location": "C6.302",
     "capacity": 25
}
```
Response: Room Object

### 2.
Functionality: update an existing room to the system
Route: /locations/updateRoom
Request type: POST
Request body: 
```
{
     "location": "C6.302",
     "capacity": 25
}
```
Response: Updated Room Object

### 3.
Functionality: delete an existing room to the system
Route: /locations/deleteRoom
Request type: POST
Request body: 
```
{
     "location": "C6.302",
}
```
Response: "Room deleted successfully" 

### 4.
Functionality: get all rooms in the system
Route: /locations/:num
Request type: GET
Parameters: all || room number
Response: Array of rooms


### 5.
Functionality: add a new staff member to the system
Route: /staffMembers/staff
Request type: POST
Request body: 

```
{
        "name": "Sarah", 
        "gender": "female", 
        "email":    "sarah@student.guc.edu.eg",
        "salary": 20000,
        "officeLocation": "C6.302",
        "type": "Academic Member",
        "role": "Teaching Assistant",
        "faculty": "Engineering",
        "department": "MET",
        "dayOff": "Sunday"
}
```

Response: Staff Object

### 6.
Functionality: update a new staff member to the system
Route: /staffMembers/staff
Request type: PUT
Request body: 

```
{
	"gucId": "HR-1",
   	"name": "Sarah",
	"dayOff": "Sunday",
    	"salary": 23400,
	"leaveBalance": leaveBalance
    	"officeLocation": "C6.002",
}

```
Response: Updated Staff Object

### 7.
Functionality: delete an existing staff member from the system
Route: /staffMembers/staff
Request type: DELETE
Request body: 
```
{
    "gucId": "CI-1"
}
```
Response: "Staff deleted successfully"

### 8.
Functionality: sign a staff member in the system
Route: /staffMembers/signIn
Request type: POST
Request body: 
```
{
	"gucId": "HR-1",
}

```
Response: Staff Object (with attendance record being updated)

### 9.
Functionality: sign a staff member out of the system
Route: /staffMembers/signOut
Request type: POST
Request body: 
```
{
	"gucId": "HR-1",
}

```
Response: Staff Object (with attendance record being updated with endTime)

### 10.
Functionality: log in the system
Route: /login
Request type: POST
Request body: 
```
{
"gucId": "HR-1",
"password": "123456"
}

```
Response: the token with some data

### 11.
Functionality: log out the system
Route: /logout
Request type: POST

Response: "Logged out successfully"

### 12.
Functionality: a user can change his/her password
Route: /staffMembers/changePassword
Request type: POST
Request body: 
```
{
"oldPassword": "123456",
"newPassword": "234567"
}

```
Response: updated User data

### 13. 
Functionality: create a new faculty
Route: /faculties/faculty
Request type: POST
Request body: 
```
{
    "code": "FAC3",
    "name": "faculty3"
}
```
Response: Faculty Object

### 14. 
Functionality: update a faculty
Route: /faculties/faculty
Request type: PUT
Request body: 
```
{
    "code": "FAC3",
    "name": "faculty3",
    "newName": "faculty3updated"
}

```
Response: Faculty Object

### 15. 
Functionality: delete a faculty
Route: /faculties/faculty
Request type: DELETE
Request body: 
```
{
    "code": "FAC2"
}
```
Response: "Faculty Deleted successfully"

### 16. 
Functionality: add a department to an existing faculty
Route: /departments/department
Request type: POST
Request body: 
```
{
    "facultyCode": "FAC",
    "depName": "dep4"
}

```
Response: Department Object

### 17. 
Functionality: update a department to an existing faculty
Route: /departments/department
Request type: PUT
Request body: 
```
{
   	"facultyCode": "FAC",
    	"depName": "dep4",
	"HOD": "AC-1",
	newFacultyCode": "FAC3"
}
```
Response: Department Object

### 18. 
Functionality: delete a department 
Route: /departments/department
Request type: DELETE
Request body: 
```
{
    "faculty": "FAC",
    "department": "dep1"
}
```
Response: "Department Deleted successfully"

### 19. 
Functionality: add a course to an existing department
Route: /courses/course
Request type: POST
Request body: 
```
{
    "faculty": "FAC3",
    "department": "dep4",
    "name": "course1"
}


```
Response: Course Object

### 20. 
Functionality: update a course 
Route: /courses/course
Request type: PUT
Request body: 
```
{
    "faculty": "FAC3",
    "department": "dep4",
    "name": "course3",
    "newName": "course3updated"
}

```
Response: Updated Course Object

### 21. 
Functionality: delete a course 
Route: /courses/course
Request type: DELETE
Request body: 
```
{
    "faculty": "FAC3",
    "department": "dep4",
    "course": "course3"
}
```
Response: "Course Deleted successfully"

### 22. 
Functionality: View all the staff in his/her department along with their profiles
Route: /departments/getAllStaffMembers
Request type: GET
Response: Array of members along with their profile

### 23.
Functionality: View all the staff in his/her department per course along with their profiles
Route: /departments/getAllStaffMembers/:course
Request type: GET
Request Parameters:
- course: course name 
Response: Array of members along with their profile

### 24. 
Functionality: View day off for all the staff in his/her department
Route: /departments/viewDayOff
Request type: GET
Response: Array of members along with their day off

### 25.
Functionality: View day off for a specific staff in his/her department
along with their profiles
Route: /departments/viewDayOff/:idStaff
Request type: GET
Request Parameters:
- idStaff: id of the staff member
Response: Array of members along with their profile

### 26. 
Functionality: View the coverage of each course in his/her department
Route: /departments/viewCourseCoverage
Request type: GET
Response: Array of coverage of each course

AHMED


### 27. 
Functionality: View the coverage of course(s) he/she is assigned to
Route: /academicMember/courseInstructor/courseCoverage
Request type: GET
Response: Array of coverage of course


### 28. 
Functionality: View the slots’ assignment of course(s) he/she is assigned to
Route: /academicMember/courseInstructor/slotsAssignment
Request type: GET
Response: Array of coverage of course


### 29. 
Functionality: Assign an academic member to an unassigned slots in course(s) he/she is assigned to
Route: /academicMember/courseInstructor/slotsAssignment
Request type: POST
```
{
  	"gucId": "AC-7",
  	"courseName": "Computer Science 2",
  	"slot": {
    		"day": "Tuesday",
    		"time": "5:45 PM"
  	}
}
```
Response: Object —> assigned academic member with its corresponding slot

### 30. 
Functionality: Update/delete assignment of academic member in course(s) he/she is assigned to
Route: /academicMember/courseInstructor/slotsAssignment
Request type: PUT
```
{
  	"gucId": "AC-7",
  	"courseName": "Computer Science 2",
  	"slot": {
    		"day": "Tuesday",
    		"time": "5:45 PM"
  	}
}
```
Response: Updated —> assigned academic member with its corresponding slot

### 31. 
Functionality: remove assignment of academic member in course(s) he/she is assigned to
Route: /academicMember/courseInstructor/slotsAssignment
Request type: DELETE
```
{
  	"gucId": "AC-7",
  	"courseName": "Computer Science 2",
  	"slot": {
    		"day": "Tuesday",
    		"time": "5:45 PM"
  	}
}
```
Response: Updated —> assigned academic member with its corresponding slot showing it is not assigned (null)

### 32
Functionality: Assign a course instructor for each course in his department
Route: /departments/assignInstructor
Request type: POST
Request body: 
```
{
 "gucId": "AC-1",
 "name":"computer science"
}
```
Response: "data": {
        "msg": "Course assigned to AC-2 successfully",
        "course": "computer science",
        "assigned_To": "AC-2"
    }


### 33
Functionality: update a course instructor for each course in his department
Route: /departments/assignInstructor
Request type: PUT
Request body: 
```
{
 "gucId": "AC-1",
 "newName":"computer science 1",
 "oldName":"computer science"
}
```
Response: "data": {
        "msg": "Course assigned to AC-1 successfully",
        "course": {
            "coverage": 0,
            "_id": "5fdf2d8aff51cc02dfd69a44",
            "department": "5fdf2d8aff51cc02dfd69a41",
            "name": "computer science",
            "slots": [],
            "__v": 0
        },
        "assigned_To": "AC-1"
    }


### 34
Functionality: delete a course instructor for each course in his department
Route: /departments/assignInstructor
Request type: DELETE
Request body: 
```
{
 "gucId": "AC-1",
 "name":"computer science"
}
```
Response: "Course deleted successfully"

### 35
Functionality: View all their attendance records, or they can specify exactly which month to view.
Route: /attendance/viewAttendance
Request type: GET
Request body:
```
{
    "all": "all"
}
```
Response: AttendanceRecord Object of all his attendance records
```
{
    "month1": 5,
    "month2": 6
}
```
Response: Attendance Record Object of all the attendance records from 11.May till 10.June in this year

### 36
Functionality: View any staff member attendance record.
Route: /attendance/hr/viewAttendanceRequest 
type: GET
Request body:
```
{
    "id": "HR-3",
    "all": "all"
}
```
Response: AttendanceRecord Object of all the attendance records exists for HR-3
```
{
    "id": "HR-3",
    "month1": 5,
    "month2": 6
}
```
Response: AttendanceRecord Object of the attendance records for HR-3 from 11. May to 10. June


### 37
Functionality: Manually add a missing signin/sign out record of a staff member except for himself/herself.
Route: /attendance/addMissingSignInOutRequest 
type: PUT
Request body:
```
{
    "id":"HR-3",
    "signIn":"17:56:00",
    "signOut":"",
    "date":"2020-12-14",
    "day": "Friday",
    "number": 4
}
```
Response: "The missing sign in/out is added successfully"Note: The number in the body indicates the number of the added missing sign in/out.(i.e. If there are 4 sign in/out in that day, and there is missing sign in in 3rd record of that day, number should be 3 I that case).

### 38
Functionality: Update the salary of a staff member.
Route: /staffMembers/updateSalaryRequest 
type: PUT
Request body:
{
    "id":"HR-4",
    "newSalary":30000
}
Response: “Salary is updated successfully to 3500"

### 39
Functionality: Add course slot(s) in his/her course.
Route: slots/courseSlotRequest 
type: POST
Request body:
```
{
    "id":"AC-3",
    "course":"CS1",
    "day": "Saturday",
    "time": "14:45",
    "location": "C6.306"
}
```
Response: "The slot is added successfully"

### 40
Functionality: Update course slot(s) in his/her course.
Route: slots/courseSlotRequest type: PUTRequest body:
```
{
    "id":"AC-3",
    "course":"CS1",
    "dayOld": "Saturday",
    "timeOld": "14:45",
    "locationOld": "C6.306",
    "dayNew": "Sunday",
    "timeNew": "16:45",
    "locationNew": "C6.206"
}
```
Response: "The slot is updated successfully"

### 41
Functionality: Delete course slot(s) in his/her course.
Route: slots/courseSlotRequest 
type: DELETE
Request body:
```
{
    "id":"AC-3",
    "course":"CS1",
    "day": "Saturday",
    "time": "14:45",
    "location": "C6.306"
}
```
Response: "The slot is deleted successfully"

### 42
Functionality: View their schedule. Schedule should show teaching activities and replacements if present.
Route: /staffMembers/viewMyScheduleRequest 
type: GET
Response: Object contains the slots assigned

### 43
Functionality: View all the staff in his/her department or per course along with their profiles
Route: /academicMember/courseInstructor/staffMembers/:courseNameRequest type: GET
Parameters: courseName can be "all" if you want to view all the department staff
Response: Staff records in the same department

### 44
Functionality: Assign an academic member in each of his/her course(s) to be a course coordinator
Path: /academicMember/courseInstructor/courseCoordinator
Method: POST
```
Body: {
    "gucId": "AC-9",
    "courseName": "Computer Science 2"
}
```
Response: Staff records in the same department

### 45
Functionality: View if they have missing days.
Route: /attendance/viewMissingDays
Request type: GET
Response: "Number of missing days: 3"

### 46
Functionality: View if they are having missing hours or extra hours.
Route: /attendance/viewHoursRequest 
type: GET
Response: "Missing/extra hours: -7 hrs. 30 min."

