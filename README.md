# Appointment Assistant
Cloud Service for Maintaining Apppointments via slots for personal Meetings.

# Target date feb 20

# Functionality
1. Log in sign up
2. 
3. no media queries

# tech
1. material ui, tailwindcss, react, vite
2. node, express, dynamo, s3, cloud, aws

# Screens
1. Login
2. Signup
3. Forgot Password
4. Calender
5. Home Page
6. Profile Page - Admin/ user
7. Appointment Page - Admin /user
8. Report Generation Page
9. Past and Upcoming Appointments Page
15. About Us

# Collections

# Roles
1. parth - routes and middleware
2. sourab - cloud and dao
3. saubhagya - frontend half
4. krish - frontend half


# Collections
```
1. Keys {
  KEK: string,
  users_dek: {
    id: string,
    dek: string
  }
},

2. Users {
    id: string,
    name: string,
    email: string,
    password: string, // encrypted
    salt: string,
    room_address: string,
    user_image_link: "" // string link for s3 url
    appointments : [ appointment_id, appointment_id, ... ]
}

4. Appointment {
  id: string,
  creation_time: string,
  appointment_time: string,
  appointment_duration: number,
  appointment_purpose: string,
  appointment_description: string,
  status: string, // accepted, rejected, pending
  appointee: user_id, ( user who is taking the appointment ) - user
  appointer: user_id, ( user who is giving the appointment ) - admin
}

# routes
only body params, no query, only json

1. login - POST -
req = {
    user_email: something@something.com - string,
    user_password: password - string,
   }
// assumed ok if response code == 200, if status isnt ok, send 401
res = {
    token = string,
}

2. signup - POST
req = {
    full_name: string,
    room_address: string,
    email: string,
    phone: string,
}
res = {
    token: string
}

3. fpass - POST
req{
    email: list
}
res:
{
    link: string
}

4. GET appointment - POSt
req{
    date: x
    token: given token,
    id = userid,
    admin = true/false
}
res:
{
    appointments [] list for that date
}
eg: 5 appointments in day x
[a1, a2, a3, a4, a5]
// if there is only 1
[a1] instead of a1

6. set appointments - POST

req {
    appointee: userid
    appionter: userid
    creation_date: string,
    appointment_time: string,
    appointment_duration: number,
    appointment_purpose: string,
    appointment_description: string,
}
res: {
    appointment: object
}

7. change status
req {
    appointment_id : string
    status: string (pending, accepted or rejected)
}

response: 
{
    appiontment: object
}

8. GET appointments - POSt
req {
    start_date: x
    end_date: y
    token: given token
    appointerid : email
}
res:
{
    appointments [] list for that date range
}

9. get users
req {
    token
}

res {
    users list of all users
    [user1, user2, user3] // list of user objects, refer to user collection
}

10. get_profile_stats
req {
    token
}

res: 
{
    statistics = [
        {
            name: string
            value: string
        },
        {
            name: string
            value: string
        },
        
    ]
}

```

# Current research
1. ask vinayak sir for money and aws
2. jwt token
3. cloud integration
4. KEK storing in amazong safely
5. Real Time notifications without using multiple api calls

# !no media queries
# credit

# added github pages at 
![here](https://krishnarajt.github.io/Appointment-Assistant)
