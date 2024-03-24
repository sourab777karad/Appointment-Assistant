import express from "express";
import assistantCtrl from "./Assistant.controllers.js";
import authenticator from "../Middlewares/Assistant.middleware.js";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/add-new-user", assistantCtrl.addNewUser);

// Any routes after this middleware require authentication
router.use(authenticator.TokenAuthenticator);

router.post(
	"/are-user-details-filled",
	authenticator.TokenAuthenticator,
	assistantCtrl.areUserDetailsFilled
);

router.post("/update-user-details", assistantCtrl.updateUserDetails);

router.post("/get-user-appointment", assistantCtrl.get_user_Appointment);

router.post("/book-appointment", assistantCtrl.setAppointment);

router.post("/change-status", assistantCtrl.changeStatusWithoutMail);

router.post("/change-status-without-mail", assistantCtrl.changeStatus);

router.post("/delete-appointment", assistantCtrl.deleteAppointment);

router.get("/get-users", assistantCtrl.getUsers);

router.get("/get-profile", assistantCtrl.getProfileByUserId);

router.post("/update-user-profile", assistantCtrl.updateUserProfile);

router.post("/get-pending-cancelled-appointments", assistantCtrl.getPendingCancelledAppointments);

router.post("/update-profile-photo", upload.single("image"), assistantCtrl.updateProfilePhoto);

router.post("/update-blocked-appointments", assistantCtrl.updateBlockedAppointments);

router.post("/get-faculty-schedule", assistantCtrl.getFacultySchedule);

router.post("/unblock-appointment", assistantCtrl.unblockAppointment);

router.delete("/delete-user", assistantCtrl.deleteUser);

router.post("/update-appointment", assistantCtrl.updateAppointment);

router.get("/realtime-message-test", assistantCtrl.realtimeMessageTest);

export default router;
