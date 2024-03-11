// import AssistantDAO from "../DAO/AssistantDAO";
import firebase from "firebase-admin";
import AssistantDAO from "../DAO/AssistantDAO.js";
import { FIREBASE_DATABASE_URL } from "../config/config.js";

export default class AssistantController {
  static async addNewUser(req, res) {
    const user = req.body;
    try {
      const Status = await AssistantDAO.add_new_user(user);
      return res.status(200).json({ status: Status });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error adding new user" });
    }
  }

  static async areUserDetailsFilled(req, res) {
    try {
      const user = req.user_decoded_details;
      // only want user id from the token
      const firebaseID = user.user_id;
      console.log(firebaseID);
      const Status = await AssistantDAO.areUserDetailsFilled(firebaseID);
      if (Status.message === "User not found") {
        return res.status(200).json({ filled: false, newUser: true });
      }
      return res.status(200).json({ filled: Status.status, userDetails: Status.userDetails ,newUser: false });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error checking user details" });
    }
  }

  // update user details
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

  static async get_user_Appointment(req, res) {
    try {
      const user = req.user_decoded_details;
      const Ap_date = req.body;
      // get appointments of the user with all the given and taken appointments
      const appointments = await AssistantDAO.getAppointment(user.user_id, Ap_date);
      // now sort appointments into taken and given appointments
      const taken_appointments = [];
      const given_appointments = [];
      for (let i = 0; i < appointments.length; i++) {
        if (appointments[i].schedular_id === user.user_id) {
          given_appointments.push(appointments[i]);
        } else {
          taken_appointments.push(appointments[i]);
        }
      }
      return res.status(200).json({ taken_appointments, given_appointments });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error retrieving appointment" });
    }
  }
  static async setAppointment(req, res) {
    try {
      const appointment_details = req.body;

      const appointment = await AssistantDAO.SetAppointment(appointment_details);
      // taken appointments and given appointments add appointment id to the user collection for if the user is scheduler insert the appointment id into the users taken appointment attribute array and if the user is the appointer insert the appointment id into the users given appointment attribute array.
      // schedular , appointee are the attributes in appointment_details
      const schedularId = appointment_details.schedular;
      const appointeeId = appointment_details.appointee;

      const result = await AssistantDAO.add_appointment_to_user(schedularId, appointeeId, appointment._id); 

      return res.status(200);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error setting appointment" });
    }
  }
  static async getUsers(req, res) {
    try {
      const users = await AssistantDAO.getUsers();
      res.status(200).json(users);
    } catch (e) {
      console.error(`Unable to get users: ${e}`);
      res.status(500).json({ message: `Unable to get users: ${e}` });
    }
  }
  static async getProfile(req, res) {
    try {
      // Assuming you have some authentication middleware that verifies the token
      // and attaches user information to the request object, you can use it to get the user ID.

      const user = req.user_decoded_details; // Replace with the actual property containing user ID
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
  static async changeStatus(req, res) {
    try {
      const appointmentId = req.body.appointment_id; // Get the appointment ID from the request body
      const status = req.body; // Get the status from the request body
      const result = await AssistantDAO.changeStatus(appointmentId, status);
      res.status(200).json(result);
    } catch (e) {
      console.error(`Unable to change status: ${e}`);
      res.status(500).json({ message: `Unable to change status: ${e}` });
    }
  }

  static async uploadProfilePhoto(req, res) {
    try {
      const userId = req.body.uid; // Replace with the actual property containing user ID
      const image = req.file; // Replace with the actual property containing the image file
      if (!image) {
        return res.status(400).json({ message: "No image uploaded" });
      }
      let bucket = firebase.storage().bucket();

      let filename = uuidv4() + "-" + Date.now() + ".jpg";
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
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Error uploading profile photo" });
    }
  }

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
          await bucket.file(`/profile-photos/${filename}`).delete();
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
}
