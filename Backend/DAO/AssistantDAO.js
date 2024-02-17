// import AWS from 'aws-sdk';
// import config from '../config/config.js'

// variable to hold db connection
let cluster0;

export default class AssistantDAO {
     // Method to inject the database connection
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
				`Unable to establish a collection handle in LuxuriantDAO: ${e}`
			);
		}
	}

    //method to setappointment
    async setAppointment(
        appointee,
        appointer,
        creation_time,
        appointment_time,
        appointment_duration,
        appointment_purpose,
        appointment_description
    ) {
        // Check if the appointment already exists
        let appointment = await cluster0
            .collection("appointments")
            .findOne({ appointee, appointer });
    
        if (appointment) {
            console.log("The appointment already exists", appointment);
    
            // If the appointment exists and has different information, update it
            if (
                appointment.creation_time !== creation_time ||
                appointment.appointment_time !== appointment_time ||
                appointment.appointment_duration !== appointment_duration ||
                appointment.appointment_purpose !== appointment_purpose ||
                appointment.appointment_description !== appointment_description
            ) {
                const result = await cluster0
                    .collection("appointments")
                    .findOneAndUpdate(
                        { appointee, appointer },
                        {
                            $set: {
                                creation_time,
                                appointment_time,
                                appointment_duration,
                                appointment_purpose,
                                appointment_description
                            },
                        },
                        { returnOriginal: false }
                    );
                appointment = result.value;
            }
        } else {
            // If the appointment does not exist, add it to the database
            const result = await cluster0.collection("appointments").insertOne({
                appointee,
                appointer,
                creation_time,
                appointment_time,
                appointment_duration,
                appointment_purpose,
                appointment_description
            });
            appointment = result.ops[0];
        }
    
        return appointment;
    }
}
