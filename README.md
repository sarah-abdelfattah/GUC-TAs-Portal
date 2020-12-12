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
     "location": "c6.302",
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
     "location": "c6.302",
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
     "location": "c6.302",
}
```
Response: "Room deleted successfully" ### 1. 
Functionality: add a room to the system
Route: /locations/createRoom
Request type: POST
Request body: 
```
{
    "type": "office",
     "location": "c6.302",
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
     "location": "c6.302",
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
     "location": "c6.302",
}
```
Response: "Room deleted successfully" 
