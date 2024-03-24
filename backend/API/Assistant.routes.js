import express from "express";
import assistantCtrl from "./Assistant.controllers.js";
import authenticator from "../Middlewares/Assistant.middleware.js";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/add-new-user", assistantCtrl.addNewUser);

// Any routes after this middleware require authentication
router.use(authenticator.TokenAuthenticator);

// Define a POST route at "/are-user-details-filled" that first authenticates the user's token, then calls the areUserDetailsFilled method in the assistantCtrl controller
router.post(
	"/are-user-details-filled",
	authenticator.TokenAuthenticator,
	assistantCtrl.areUserDetailsFilled
);

// Define a POST route at "/update-user-details" that calls the updateUserDetails method in the assistantCtrl controller
router.post("/update-user-details", assistantCtrl.updateUserDetails);

// Define a POST route at "/get-user-appointment" that calls the get_user_Appointment method in the assistantCtrl controller
router.post("/get-user-appointment", assistantCtrl.get_user_Appointment);

// Define a POST route at "/get-appointments" that calls the getAppointments method in the assistantCtrl controller
router.post("/book-appointment", assistantCtrl.setAppointment);

// Define a POST route at "/change-status" that calls the changeStatus method in the assistantCtrl controller
router.post("/change-status", assistantCtrl.changeStatus);

// Define a POST route at "/change-status-without-mail" that calls the changeStatusWithoutMail method in the assistantCtrl controller
router.post("/change-status-without-mail", assistantCtrl.changeStatusWithoutMail);

// Define a POST route at "/delete-appointment" that calls the deleteAppointment method in the assistantCtrl controller
router.post("/delete-appointment", assistantCtrl.deleteAppointment);

// Define a GET route at "/get-users" that calls the getUsers method in the assistantCtrl controller
router.get("/get-users", assistantCtrl.getUsers);

// Define a GET route at "/get-profile" that calls the getProfileByUserId method in the assistantCtrl controller
router.get("/get-profile", assistantCtrl.getProfileByUserId);

// Define a POST route at "/update-user-profile" that calls the updateUserProfile method in the assistantCtrl controller
router.post("/update-user-profile", assistantCtrl.updateUserProfile);

// Define a POST route at "/get-pending-cancelled-appointments" that calls the getPendingCancelledAppointments method in the assistantCtrl controller
router.post("/get-pending-cancelled-appointments", assistantCtrl.getPendingCancelledAppointments);

// Define a POST route at "/update-profile-photo" that first handles file upload with middleware, then calls the updateProfilePhoto method in the assistantCtrl controller
router.post("/update-profile-photo", upload.single("image"), assistantCtrl.updateProfilePhoto);

// Define a POST route at "/update-blocked-appointments" that calls the updateBlockedAppointments method in the assistantCtrl controller
router.post("/update-blocked-appointments", assistantCtrl.updateBlockedAppointments);

// Define a POST route at "/get-faculty-schedule" that calls the getFacultySchedule method in the assistantCtrl controller
router.post("/get-faculty-schedule", assistantCtrl.getFacultySchedule);

// Define a POST route at "/unblock-appointment" that calls the unblockAppointment method in the assistantCtrl controller
router.post("/unblock-appointment", assistantCtrl.unblockAppointment);

// Define a DELETE route at "/delete-user" that calls the deleteUser method in the assistantCtrl controller
router.delete("/delete-user", assistantCtrl.deleteUser);

// Define a POST route at "/update-appointment" that calls the updateAppointment method in the assistantCtrl controller
router.post("/update-appointment", assistantCtrl.updateAppointment);

// Define a GET route at "/realtime-message-test" that calls the realtimeMessageTest method in the assistantCtrl controller
router.get("/realtime-message-test", assistantCtrl.realtimeMessageTest);

// Export the router object as the default export of this module
export default router;
