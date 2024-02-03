# Appointment Assistant
Cloud Service for Maintaining Apppointments via slots for personal Meetings.

# Target date Mar 1

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

# Current research
1. ask vinayak sir for money and aws
2. jwt token
3. cloud integration
4. KEK storing in amazong safely
5. Real Time notifications without using multiple api calls

# !no media queries
# credit
