# milestone-1-team51
- UML: https://drive.google.com/file/d/1pAq3gUUhluCyixunRP-y6evduW2N5mhG/view?usp=sharing
- To launch the server: npm /server/index.js
- The server is listening to port 3000
- for seeded data (some locations/departments/faculties/staff members) please uncomment "dummy.seedDB();" found in index.js, then run once then comment it back again after seeing the last message "Seeded TA successfully"
- Routes: 


### 1.
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
Response: the token with some data ( first login and last login )

### 2.
Functionality: log out the system
Route: /logout
Request type: POST

Response: "Logged out successfully"

### 3.
Functionality: View their profile.
Route: /staffMembers/profile
Request type: GET

Response: the logged in person’s profile

### 4.
Functionality: View their profile.
Route: /staffMembers/profile
Request type: PUT
Request body: 
```
{
    "gender": "male"
}

```
Response: "Profile Updated Successfully"

### 5.
Functionality: a user can change his/her password
Route: /staffMembers/changePassword
Request type: PUT
Request body: 
```
{
"oldPassword": "123456",
"newPassword": "234567"
}

```
Response:  "Password changed successfully"

### 6.
Functionality: sign a staff member in the system
Route: /staffMembers/signIn
Request type: POST

Response:  "Signed in Successfully" 

### 7.
Functionality: sign a staff member out the system
Route: /staffMembers/signOut
Request type: POST

Response:  "Signed out Successfully" 

### 8.
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


### 9.
Functionality: View if they have missing days.
Route: /attendance/viewMissingDays
Request type: GET

Response: "Number of missing days: 3"

### 10.
Functionality: View if they are having missing hours or extra hours.
Route: /attendance/viewHours
Request type: GET

Response: "Missing/extra hours: -7 hrs. 30 min."

### 11. 
Functionality: add a room to the system
Route: /locations/location
Request type: POST
Request body: 

```
{
    "type": "office",
     "location": "C6.302",
     "capacity": 25
}
```
Response: Created room objecct


### 12. 
Functionality: update a room to the system
Route: /locations/location
Request type: PUT
Request body: 

```
{
    "location": "C1.111",
    "type": "Lab",
    "newLocation": "C2.222",
    "capacity": "222"
}
```
Response: "Location Updated Successfully"

### .
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
Note: upon deleting, any staff member with that location, the location will be set undefined

### 13.
Functionality: get all rooms in the system
Route: /locations/:num
Request type: GET
Parameters: all || room number
Response: Array of rooms

### 14. 
Functionality: create a new faculty
Route: /faculties/faculty
Request type: POST
Request body: 
```
{
    "code": "test",
    "name": "Test Faculty"
}
```
Response: Created Faculty Object

### 15. 
Functionality: update a faculty
Route: /faculties/faculty
Request type: PUT
Request body: 
```
{
    "code": "test",
    "newName": "Test Faculty Updated"
}

```
Response: "Faculty updated successfully"

### 16. 
Functionality: delete a faculty
Route: /faculties/faculty
Request type: DELETE
Request body: 
```
{
    "code": "test"
}
```
Response: "Faculty Deleted successfully"
note: upon deletion, any department under this faculty, its faculty is made undefined

### 17. 
Functionality: add a department to an existing faculty
Route: /departments/department
Request type: POST
Request body: 
```
{
	"facultyCode": "ENG",
    	"depName": "Test dep with HOD",
   	 "HOD": "AC-1"
}
```
Response: Created Department Object
Note: HOD is optional while creation

### 18. 
Functionality: update a department to an existing faculty
Route: /departments/department
Request type: PUT
Request body: 
```
    {
    "facultyCode": "ENG",
    "depName": "Test dep with HOD",
    "newFacultyCode": "LAW"

```
Response: "Department Updated Successfully"

### 19. 
Functionality: delete a department 
Route: /departments/department
Request type: DELETE
Request body: 
```
{
    "facultyCode": "ENG",
    "depName": "Test dep with HOD"
}
```
Response: "Department Deleted successfully"
note: upon deletion, any course under this department, its department is made undefined

### 20. 
Functionality: add a course to an existing department
Route: /courses/course
Request type: POST
Request body: 
```
{
    "facultyCode": "ENG",
    "departmentName": "MET",
    "courseName": "Tested Course"
}

```
Response: Created Course Object

### 21. 
Functionality: update a course 
Route: /courses/course
Request type: PUT
Request body: 
```
{
    "facultyCode": "MNGT",
    "departmentName": "Business Informatics",
    "courseName": "Tested Course",
    "newName": "Tested Course Updated"
}

```
Response: "Course Updated Successfully" 

### 22. 
Functionality: delete a course 
Route: /courses/course
Request type: DELETE
Request body: 
```
{
      "facultyCode": "MNGT",
    "departmentName": "Business Informatics",
    "courseName": "Tested Course",
}
```
Response: "Course Deleted successfully"

### 23.
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
        "officeLocation": "A1.001",
        "type": "Academic Member",
        "role": "Teaching Assistant",
        "faculty": "ENG",
        "department": "MET",
        "dayOff": "Sunday"
}
```

Response: Created Staff Object


### 24.
Functionality: update a new staff member to the system
Route: /staffMembers/staff
Request type: PUT
Request body: 

```
{
    "gucId": "AC-1",
    "faculty": "Eng",
    "department": "MET",
    "officeLocation": "A1.002"
}

```
Response: Updated Staff Object

### 25.
Functionality: delete an existing staff member from the system
Route: /staffMembers/staff
Request type: DELETE
Request body: 
```
{
    "gucId": "AC-1",
}
```
Response: "Staff deleted successfully"
Note: upon deletion, HOD of department is removed if it was this staff, CC of Course is removed if it was this staff,
course coverage is updated, location capacity is updated 

### 26.
Functionality: Manually add a missing signin/sign out record of a staff member except for himself/herself.
Route: /attendance/addMissingSignInOut
Request type: PUT
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

### 27.
Functionality: View any staff member attendance record.
Route: /attendance/viewAttendance
Request type: GET
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

### 28.
Functionality: View staff members with missing hours/days.Route: /attendance/viewStaffMissingRequest type: GETRequest body:Response: Array of staffMember Object

### 29.
Functionality: Update the salary of a staff member.
Route: /staffMembers/updateSalary
Request type: PUT
Request body:
{
    "id":"HR-4",
    "newSalary": 234
}
Response: “Salary is updated successfully to 234"


