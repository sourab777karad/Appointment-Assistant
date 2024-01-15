# Baadal-Pe-Kaksha
Cloud Drive and Assignment uploading and submission website to replicate functionality of Google classroom, but for our university. 

# Target date Jan 30

# Functionality
1. Log in sign up
2. Student login and prof login
3. Id verification by uploading image of id for teachers
4. Every teacher can create classes
5. Every class has class teacher, and every class has students
6. N number of assignments can be created by teacher
7. N number of submissions from student. You can resubmit. Previous pdf is deleted. New pdf is added to s3 bucket.
8. jwt Tokenization
9. comments for each assignment
10. Option to ask teacher to postpone date.
11. Schedule assignments
12. Secure
13. no media queries
    
# tech
1. material ui, tailwindcss, react, vite
2. node, express, dynamo, s3, cloud, aws

# Screens
1. Login - Krish
2. signup - Krish
3. homepage - which classes screen - Krish
4. Profile page - basic stats diff student/teacher - Krish
   
6. classroom page - teacher/student - Sau
7. submissions for assignments - teacher - Sau
8. todo - student - Sau
9. Assignment screen - Sau
10. About - Sau

# Collections
1. Assignments
{
  assignment_id,
  classroom_id,
  created_time,
  name,
  description,
  attached_docs: []
  assignment_date
  deadline,
  submitted_students: [student1id, student2id]
  comments [comment_id, comment_2id]
}
1. Students
{
  student_id,
  Classes: [classroomid1, classroomid2]
  name
  email
  submissions: [submision1_id, submission2_id]
}
3. Teachers
{
  teacher_id
  teacher_email
  teacher_name
  classes: [class1id, class2id]
}
7. Classes
{
  class_id
  class_name
  class_desc
  students: [student1id, studetn2id]
  class_teacher: Teacherid
  assignments [assignment1_id, assignment2_id] 
}
9. Comments
{
  student_id:
  assignemnt_id:
  message:
  datetime:
}
11. Submissions
{
  student_id:
  document_s3_link: []
  doc_name
  assignment_id:
  submission_datetime:
}

# Roles
1. parth - routes and middleware
2. sourab - cloud and dao
3. saubhagya - frontend half
4. krish - frontend half


# !no media queries
# credit
