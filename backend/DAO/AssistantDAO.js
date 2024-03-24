import { ObjectId } from "mongodb";

// variable to hold db connection
let cluster0;
export default class AssistantDAO {
  // Method to inject the database connection
  /**
   * @method InjectDB
   * @description Injects the database connection into the AssistantDAO class.
   * @param {Object} conn - The database connection object.
   * @returns {Promise<void>} - A promise that resolves when the database connection is injected.
   */
  static async InjectDB(conn) {
    // If the connection is already established, return
    if (cluster0) {
      return;
    }
    try {
      // Establish a connection to the database
      cluster0 = await conn.db("Appointment-Assistant");
    } catch (e) {
      // Log any errors that occur during connection
      console.error(
        `Unable to establish a collection handle in Appointment-Assistant: ${e}`
      );
    }
  }

  /**
   * @method newUser
   * @description Creates a new user in the database.
   * @param {string} email - The email of the user.
   * @param {string} name - The name of the user.
   * @param {string} room_address - The room address of the user.
   * @returns {Promise<Object>} - A promise that resolves with the result of the user creation.
   */
  //method to create new user
  static async add_new_user(user) {
    // user will be getting from
    try {
      // check user exist before adding
      const userExist = await this.userExist(user.email);
      if (userExist) {
        console.log("User already exist");
        return false;
      }
      // append the user details to the user object
      user.single_appointment_duration = 15;
      user.single_appointment_start_time = 9;
      user.single_appointment_end_time = 17;
      user.break_between_appointments = 5;
      user.student_meeting_start_time = 16;
      user.student_meeting_end_time = 17;
      user.blocked_appointments = [];
      user.taken_appointments = [];
      user.given_appointments = [];

      // Insert the user into the 'users' collection
      await cluster0.collection("users").insertOne(user);
      return true;
    } catch (e) {
      console.error(`Unable to create new user: ${e}`);
      return { error: e };
    }
  }

  // function to check user exist in the database
  static async userExist(email) {
    try {
      const user = await cluster0.collection("users").findOne({ email: email });
      if (!user) {
        console.log("User not found");
        return false;
      }
      return true;
    } catch (e) {
      console.error(`Unable to check user existence: ${e}`);
      throw e;
    }
  }

  /**
   * @method SetAppointment
   * @description Sets an appointment in the database.
   * @param {string} appointee - The email of the appointee.
   * @param {string} appointer - The email of the appointer.
   * @param {Date} creation_time - The creation time of the appointment.
   * @param {Date} appointment_time - The time of the appointment.
   * @param {number} appointment_duration - The duration of the appointment in minutes.
   * @param {string} appointment_purpose - The purpose of the appointment.
   * @param {string} appointment_description - The description of the appointment.
   * @returns {Promise<Object>} - A promise that resolves with the created or updated appointment.
   */
  //method to setappointment
  static async SetAppointment(appointment_details) {
    try {
      // add attribute cancellation_message to the appointment_details object
      appointment_details.cancellation_message = "";
      // add attribute status to the appointment_details object
      appointment_details.status = "pending";
      // Insert the appointment_details into the 'appointments' collection
      const result = await cluster0
        .collection("appointments")
        .insertOne(appointment_details);
      appointment_details._id = result.insertedId; // Get the id of the inserted document
      return appointment_details; // Return the complete appointment object
    } catch (e) {
      console.error(`Unable to set appointment: ${e}`);
      throw e;
    }
  }

  static async areUserDetailsFilled(firebaseID) {
    try {
      const user = await cluster0
        .collection("users")
        .findOne({ firebase_id: firebaseID });
      if (!user) {
        console.log("User not found");
        return { message: "User not found", status: false };
      }
      if (!user.phone_number && !user.room) {
        console.log("User details not filled");
        return { userDetails: user, status: false };
      }
      return { userDetails: user, status: true };
    } catch (e) {
      console.error(`Unable to check user details: ${e}`);
      throw e;
    }
  }

  // update user details
  static async updateUserDetails(user) {
    try {
      const result = await cluster0.collection("users").updateOne(
        { email: user.email },
        {
          $set: {
            phone_no: user.phone_no,
            room_address: user.room_address,
            single_appointment_duration: user.single_appointment_duration,
            single_appointment_start_time: user.single_appointment_start_time,
            single_appointment_end_time: user.single_appointment_end_time,
            break_between_appointments: user.break_between_appointments,
            student_meeting_start_time: user.student_meeting_start_time,
            student_meeting_end_time: user.student_meeting_end_time,
          },
        }
      );
      return result;
    } catch (e) {
      console.error(`Unable to update user details: ${e}`);
      throw e;
    }
  }

  static async getAppointment(firebase_ID, datetime) {
    try {
      // get all appointments from the appointments collection where scheduler_id or appointee_id is equal to the firebase_ID and the appointment in range of the given date and also sort them into taken appointments and given appointments
      const appointments = await cluster0
        .collection("appointments")
        .find({
          $or: [{ scheduler_id: firebase_ID }, { appointee_id: firebase_ID }],
          appointment_date: {
            $gte: datetime.date.start_date,
          },
        })
        .toArray();
      return appointments;
    } catch (e) {
      console.error(`Unable to get appointments: ${e}`);
      throw e;
    }
  }

  // method to get appointment by id
  static async getAppointmentById(appointmentId) {
    try {
      const appointment = await cluster0
        .collection("appointments")
        .findOne({ _id: new ObjectId(appointmentId) });
      if (!appointment) {
        console.log("Appointment not found");
        return { message: "Appointment not found" };
      }
      return appointment;
    } catch (e) {
      console.error(`Unable to get appointment: ${e}`);
      throw e;
    }
  }

  static async getUsers() {
    try {
      const users = await cluster0.collection("users").find().toArray();
      return users;
    } catch (e) {
      console.error(`Unable to get users: ${e}`);
      throw e;
    }
  }
  
  static async getProfile(userId) {
    try {
      const user_Profile = await cluster0
        .collection("users")
        .findOne({ firebase_id: userId });
      if (!user_Profile) {
        console.log("User not found");
        return { message: "User not found" };
      }
      return user_Profile;
    } catch (e) {
      console.error(`Unable to get profile stats: ${e}`);
      throw e;
    }
  }

  static async deleteAppointment(appointmentId) {
    try {
      const result = await cluster0
        .collection("appointments")
        .deleteOne({ _id: new ObjectId(appointmentId) });

      console.log(`Deleted count: ${result.deletedCount}`); // Log the number of deleted documents

      if (result.deletedCount === 0) {
        console.log("No appointment found with the given ID");
        return { message: "No appointment found with the given ID" };
      }

      return { message: "Appointment deleted successfully" };
    } catch (e) {
      console.error(`Unable to delete appointment: ${e}`);
      throw e;
    }
  }

  static async changeStatus(status_details) {
    if (!ObjectId.isValid(status_details.appointment_id)) {
      console.log(`Invalid ID: ${status_details.appointment_id}`);
      return { message: "Invalid ID" };
    }

    try {
      const result = await cluster0
        .collection("appointments")
        .updateOne(
          { _id: new ObjectId(status_details.appointment_id) },
          { $set: { status: status_details.status } }
        );

      if (result.matchedCount === 0) {
        console.log("No appointment found with the given ID");
        return { message: "No appointment found with the given ID" };
      }
      return result;
    } catch (e) {
      console.error(`Unable to change status: ${e}`);
      throw e;
    }
  }

  // method to upload profile photo url to mongodb
  static async uploadProfilePhoto(userId, imageUri) {
    try {
      const result = await cluster0
        .collection("users")
        .updateOne(
          { firebase_id: userId },
          { $set: { profile_pic_url: imageUri } }
        );
      return result;
    } catch (err) {
      console.error(`Unable to upload profile photo: ${err}`);
      throw err;
    }
  }

  static async updateUserProfile(user_updated_details, firebaseID) {
    try {
      // Prepare an update object with only the fields that are not empty
      const update = {};
      for (const [key, value] of Object.entries(user_updated_details)) {
        if (value && key !== "_id") {
          update[key] = value;
        }
      }

      // Update user details in the users collection based on the firebaseID
      const result = await cluster0
        .collection("users")
        .updateOne({ firebase_id: firebaseID }, { $set: update });

      if (result.matchedCount === 0) {
        console.log(`No user found with FirebaseID: ${firebaseID}`);
        return null;
      }

      console.log(`Updated user with FirebaseID: ${firebaseID}`);
      return result;
    } catch (e) {
      console.error(`Unable to update user profile: ${e}`);
      throw e;
    }
  }

  // method to add appointment to user
  static async add_appointment_to_user(
    schedulerId,
    appointeeId,
    appointmentId
  ) {
    try {
      // Add the appointment ID if the user is the scheduler to the 'taken_appointments' array and add the appointment ID if the user is the appointee to the 'given_appointments' array
      await cluster0
        .collection("users")
        .updateOne(
          { firebase_id: schedulerId },
          { $push: { taken_appointments: appointmentId } }
        );
      await cluster0
        .collection("users")
        .updateOne(
          { firebase_id: appointeeId },
          { $push: { given_appointments: appointmentId } }
        );
      return true;
    } catch (err) {
      console.error(`Unable to add appointment to user: ${err}`);
      return false;
    }
  }
  // method to get pending and cancelled appointments from the given FirebaseID
  static async getPendingCancelledAppointments(firebaseID) {
    try {
      const appointments = await cluster0
        .collection("appointments")
        .find({
          $or: [{ scheduler_id: firebaseID }, { appointee_id: firebaseID }],
          status: { $in: ["pending", "cancelled"] },
        })
        .toArray();
      return appointments;
    } catch (e) {
      console.error(`Unable to get pending/cancelled appointments: ${e}`);
      throw e;
    }
  }
  // method to update blocked appointments
  static async updateBlockedAppointments(firebaseID, blockedAppointments) {
    try {
      // blockedAppointments are array of objects that i have to insert in to users collection
      // Only keep start_time and appointment_date attributes
      const result = await cluster0
        .collection("users")
        .updateOne(
          { firebase_id: firebaseID },
          { $push: { blocked_appointments: { $each: blockedAppointments } } }
        );
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  // method to get blocked appointments
  static async getBlockedAppointments(firebaseID) {
    try {
      const user = await cluster0
        .collection("users")
        .findOne({ firebase_id: firebaseID });
      if (!user) {
        console.log("User not found");
        return { message: "User not found" };
      }
      return user.blocked_appointments;
    } catch (err) {
      console.error(`Unable to get blocked appointments: ${err}`);
      throw err;
    }
  }
  // method to unblock appointment slot
  static async unblockAppointment(firebaseID, appointment_details) {
    try {
      const collection = cluster0.collection("users");
      for (const appointment of appointment_details.blocked_appointments) {
        console.log(
          "appointment_details inside unblock appointments",
          appointment
        );
        await collection.updateOne(
          { firebase_id: firebaseID },
          {
            $pull: {
              blocked_appointments: appointment,
            },
          }
        );
      }
      return true;
    } catch (err) {
      console.error(`Unable to unblock appointment: ${err}`);
      return false;
    }
  } // method to delete user
  static async deleteUser(firebaseID) {
    try {
      // just put deleted user in front of the user name
      const user = await cluster0
        .collection("users")
        .findOne({ firebase_id: firebaseID });
      if (!user) {
        console.log("User not found");
        return { message: "User not found" };
      }
      user.full_name = `deleted user ${user.name}`;
      user.email = `deleted user ${user.email}`;

      // Update the user details in the users collection
      const result = await cluster0
        .collection("users")
        .updateOne({ firebase_id: firebaseID }, { $set: user });

      return result;
    } catch (err) {
      console.error(`Unable to delete user: ${err}`);
      throw err;
    }
  }

  // method to update appointment
  static async updateAppointment(appointment_details) {
    // get the id field
    const id = appointment_details._id;
    // delete the id field
    delete appointment_details._id;
    // convert the id to ObjectId
    appointment_details._id = new ObjectId(id);
    try {
      return cluster0
        .collection("appointments")
        .updateOne(
          { _id: new ObjectId(appointment_details._id) },
          {
            $set: appointment_details,
          }
        )
        .then((result) => {
          if (result.matchedCount === 0) {
            console.log(
              `No appointment found with ID: ${appointment_details._id}`
            );
            return false;
          } else {
            console.log(
              `Updated appointment with ID: ${appointment_details._id}`
            );
            return true;
          }
        });
    } catch (err) {
      console.error(`Unable to update appointment: ${err}`);
      throw err;
    }
  }
}
