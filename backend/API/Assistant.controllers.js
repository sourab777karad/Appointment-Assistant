// import AssistantDAO from "../DAO/AssistantDAO";
import firebase from "firebase-admin";
import AssistantDAO from "../DAO/AssistantDAO.js";
import MailController from "../Services/Mail.service.js"

// class to handle all the assistant related operations
export default class AssistantController {
  // method to add new user
  static async addNewUser(req, res) {
    const user = req.body;
    try {
      const status = await AssistantDAO.add_new_user(user);
      return res.status(200).json({ status: status });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error adding new user" });
    }
  }
  // method to check if the user details are filled or not
  static async areUserDetailsFilled(req, res) {
    try {
      const user = req.user_decoded_details;
      // only want user id from the token
      const firebaseID = user.user_id;
      const appointment_date = req.body
      console.log(appointment_date)
      const Status = await AssistantDAO.areUserDetailsFilled(firebaseID);
      if (Status.message === "User not found") {
        return res.status(200).json({ filled: false, newUser: true });
      }
      if (appointment_date.date.start_date === null && appointment_date.date.end_date === null) {
        return res.status(400).json({ message: "Date range not provided" });
      }
       // get appointments of the user with all the given and taken appointments
       const appointments = await AssistantDAO.getAppointment(user.user_id, appointment_date);

       console.log(appointments)
       // now sort appointments into taken and given appointments
       const taken_appointments = [];
       const given_appointments = [];
       for (let i = 0; i < appointments.length; i++) {
         if (appointments[i].scheduler === user.user_id) {
           taken_appointments.push(appointments[i]);
         } else {
           given_appointments.push(appointments[i]);
         }
       }
       // get all users from the users collection and return the name, firebase id, email, phone number, room.
       const users = await AssistantDAO.getUsers();
       console.log(users)
      return res.status(200).json({ filled: Status.status, userDetails: Status.userDetails ,newUser: false, userSchedule:{taken_appointments, given_appointments}, users: users });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error checking user details" });
    }
  }
  // update user details in the users collection
  static async updateUserDetails(req, res) {
    try {
      const user = req.body;
      const result = await AssistantDAO.updateUserDetails(user);
      return res.status(200).json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error updating user details" });
    }
  }
  // method to get all the appointments of the user as scheduler and appointee
  static async get_user_Appointment(req, res) {
    try {
      const appointment_details = req.body;

      if (appointment_details.date.start_date === null && appointment_details.date.end_date === null) {
        return res.status(400).json({ message: "Date range not provided" });
      }
      console.log("appointment_details:",appointment_details)
      // get appointments of the user with all the given and taken appointments
      const appointments = await AssistantDAO.getAppointment(appointment_details.firebase_id, appointment_details);

      console.log(appointments)
      // now sort appointments into taken and given appointments
      const taken_appointments = [];
      const given_appointments = [];
      for (let i = 0; i < appointments.length; i++) {
        if (appointments[i].scheduler === appointment_details.firebase_id) {
          taken_appointments.push(appointments[i]);
        } else {
          given_appointments.push(appointments[i]);
        }
      }
      return res.status(200).json({ taken_appointments, given_appointments });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error retrieving appointment" });
    }
  }
  // method to set appointment by the user
  static async setAppointment(req, res) {
    try {
      const appointment_details = req.body;

      const appointment = await AssistantDAO.SetAppointment(appointment_details);
      // taken appointments and given appointments add appointment id to the user collection for if the user is scheduler insert the appointment id into the users taken appointment attribute array and if the user is the appointer insert the appointment id into the users given appointment attribute array.
      // schedular , appointee are the attributes in appointment_details
      const schedularId = appointment_details.schedular;
      const appointeeId = appointment_details.appointee;

      await AssistantDAO.add_appointment_to_user(schedularId, appointeeId, appointment._id); 

      return res.status(200);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error setting appointment" });
    }
  }
  // method to get all users from the users collection with the name, firebase id, email, phone number, room
  static async getUsers(req, res) {
    try {
      const users = await AssistantDAO.getUsers();
      res.status(200).json(users);
    } catch (e) {
      console.error(`Unable to get users: ${e}`);
      res.status(500).json({ message: `Unable to get users: ${e}` });
    }
  }
  // method to getProfile of the user by user id
  static async getProfileByUserId(req, res) {
    try {
  
      const user = req.user_decoded_details;
      const userId = user.user_id;
      
      const profile_data = await AssistantDAO.getProfile(userId);

      return res.status(200).json({ profile_data });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Error retrieving profile" });
    }
  }
  // method to delete appointment
  static async deleteAppointment(req, res) {
    try {
      const appointmentId = req.body.appointmentId; // Get the appointment ID from the request parameters
      const result = await AssistantDAO.deleteAppointment(appointmentId);
      res.status(200).json(result);
    } catch (e) {
      console.error(`Unable to delete appointment: ${e}`);
      res.status(500).json({ message: `Unable to delete appointment: ${e}` });
    }
  }
  // method to change the status of the appointment (confirmed, rejected, pending)
  static async changeStatus(req, res) {
    try {

      const status_details = req.body; // Get the appointment ID from the request body

      // check for the schedular id in the appointment collection schedular attribute if they match then update the status of the appointment
  
        // const result = await AssistantDAO.changeStatus(status_details);
        const mailController = new MailController()
        const sendmail_status = await mailController.sendMail(status_details.scheduler_email_id, status_details.status)

        // return res.status(200).json({result, sendmail_status});
        return res.status(200).json({sendmail_status});
    
    } catch (e) {
      console.error(`Unable to change status: ${e}`);
      res.status(500).json({ message: `Unable to change status: ${e}` });
    }
  }
  // method to update profile photo
  static async updateProfilePhoto(req,res){
    try{
      const decodedToken = req.user_decoded_details;
      const userId = decodedToken.user_id;
      const image = req.file; 
      console.log(image);
      if (!image) {
        return res.status(400).json({ message: "No image uploaded" });
      }
      // first delete the old profile photo
      const user = await AssistantDAO.getProfile(userId);
      const oldProfilePhotos = user.profile_pic_url;
      console.log("old profile photos", oldProfilePhotos);
      if(oldProfilePhotos && oldProfilePhotos.length > 0){
        const bucket = firebase.storage().bucket();
        for(let i = 0; i < oldProfilePhotos.length; i++){
          const urlParts = oldProfilePhotos[i].split('/');
          const filename = urlParts[urlParts.length - 1].split('?')[0];
          if(filename) {
            await bucket.file(`/profile-photos/${filename}`).delete();
          }
        }
      }
     
      // upload the new profile photo
      let bucket = firebase.storage().bucket();

      let filename = req.file.originalname;
      let fileUpload = bucket.file("/profile-photos/" + filename);

      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: "image/jpeg",
        },
      });

      blobStream.on("error", (error) => {
        console.error(
          "Something is wrong! Unable to upload at the moment." + error
        );
        return res
          .status(500)
          .json({ message: "Error uploading file", error: error.message });
      });

      blobStream.on("finish", async () => {
        // The public URL can be used to directly access the file via HTTP.
        const file = bucket.file(`/profile-photos/${filename}`);
        const publicUrl = await file.getSignedUrl({action:'read', expires: '12-31-3000'})
        await AssistantDAO.uploadProfilePhoto(userId, publicUrl);
        return res.status(200).send(publicUrl);
      });
      blobStream.end(image.buffer);
    }catch(err){
      console.error(err);
      return res.status(500).json({ message: "Error uploading profile photo" });
    }
  }
  // method to update user profile
  static async updateUserProfile(req, res){
    try {
      const decodedToken = req.user_decoded_details;
      const firebase_userId = decodedToken.user_id;
      const user_updated_details = req.body;
      const result = await AssistantDAO.updateUserProfile(user_updated_details,firebase_userId);
      return res.status(200).json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error updating user profile" });
    }
  }
  // method to get pending and cancelled appointments for that firebaseID
  static async getPendingCancelledAppointments(req, res){
    try {
      const decodedToken = req.user_decoded_details;
      const firebase_userId = decodedToken.user_id;
      const appointments = await AssistantDAO.getPendingCancelledAppointments(firebase_userId);
      
      // sort them into taken and given appointments
      const taken_appointments = [];
      const given_appointments = [];
      for (let i = 0; i < appointments.length; i++) {
        if (appointments[i].scheduler === firebase_userId) {
          taken_appointments.push(appointments[i]);
        } else {
          given_appointments.push(appointments[i]);
        }
      }
      return res.status(200).json(taken_appointments, given_appointments);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error getting pending and cancelled appointments" });
    }
  }
  
}

