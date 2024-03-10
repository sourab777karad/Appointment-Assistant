import React, { useContext, useEffect, useState } from "react";
import { UserInfoContext } from "../context/UserInfoContext";
import axios from "axios";
import { BaseUrlContext } from "../context/BaseUrlContext";
import { IconCheckbox } from "@tabler/icons-react";
import { toast } from "react-hot-toast";

const Profile = () => {
  const userDetails = useContext(UserInfoContext).userDetails;
  var [localUserDetails, setLocalUserDetails] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    room: "",
  });
  const base_url = useContext(BaseUrlContext).base_url;
  const userToken = useContext(UserInfoContext).userToken;
  const uploadProfilePicture = () => {
    // open file picker for only png and jpg files and for file size less than 5mb
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();
    fileInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (file.size > 5000000) {
        toast.error("File size should be less than 5mb");
        return;
      }
      if (file.type !== "image/png" && file.type !== "image/jpeg") {
        alert("Only PNG and JPEG files are allowed");
        return;
      }
      const formData = new FormData();
      formData.append("profile_pic", file);
      try {
        const response = await axios.post(
          `${base_url}/user/profile-pic`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          },
        );
        if (response.status === 200) {
          toast.success("Profile Picture Updated");
          setLocalUserDetails({
            ...localUserDetails,
            profile_pic_url: response.data.profile_pic_url,
          });
        }
      } catch (error) {
        toast.error("Error updating profile picture");
      }
    });
  };

  const uploadUserDetails = async () => {
    try {
      const response = await axios.post(
        `${base_url}/user/update`,
        localUserDetails,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );
      if (response.status === 200) {
        toast.success("Profile Updated");
      }
    } catch (error) {
      toast.error("Error updating profile");
    }
  };

  useEffect(() => {
    setLocalUserDetails(userDetails);
  }, [userDetails]);

  return (
    <div className="min-h-screen flex mt-16 items-center justify-center">
      <div className="flex justify-between w-4/5 max-w-screen-xl gap-20">
        {/* Profile Information */}
        <div className="w-2/5">
          <div className="bg-gray-200 p-10 rounded-lg shadow-lg border border-gray-300">
            <div className="text-center mb-8">
              <img
                className="rounded-full h-24 w-24 mx-auto mb-4 border-4 border-gray-200"
                src={
                  localUserDetails?.profile_pic_url
                    ? localUserDetails?.profile_pic_url
                    : "https://source.unsplash.com/random"
                }
                alt="Profile"
                onClick={() => {
                  // open file picker
                  uploadProfilePicture();
                }}
              />
              <h2 className="text-xl font-bold">
                {localUserDetails?.full_name}
              </h2>
            </div>
            <div className="gap-4">
              <div className="mb-4 neumorphic rounded-lg p-4 bg-white border border-gray-300">
                <h3 className="text-lg font-semibold mb-4">
                  Contact Information
                </h3>
                <p className="text-gray-600">
                  <span className="font-semibold">Email: </span>
                  {localUserDetails?.email}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Phone:</span> +91 {"  "}
                  {localUserDetails?.phone_number}
                </p>
              </div>
              <div className="neumorphic rounded-lg p-4 bg-white border border-gray-300">
                <h3 className="text-lg font-semibold mb-4">Room</h3>
                <p className="text-gray-600">{localUserDetails?.room}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Placeholder Div */}
        <div className="w-3/5 bg-gray-200 p-10 rounded-lg shadow-lg border border-gray-300">
          <div className="flex h-full w-full flex-col gap-4 justify-between">
            <div>
              <h2 className="text-2xl font-bold">Profile</h2>
            </div>
            <div className="flex flex-col gap-4 w-full">
              <label className="input input-bordered flex items-center gap-2 w-full">
                +91
                <input
                  type="text"
                  value={localUserDetails?.phone_number}
                  onChange={(e) => {
                    setLocalUserDetails({
                      ...localUserDetails,
                      phone_number: e.target.value,
                    });
                  }}
                  className="grow w-full"
                  placeholder="10 Digit Phone Number"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2 w-full">
                Name
                <input
                  type="text"
                  value={localUserDetails?.phone_number}
                  onChange={(e) => {
                    setLocalUserDetails({
                      ...localUserDetails,
                      full_name: e.target.value,
                    });
                  }}
                  className="grow w-full"
                  placeholder="Your Displayed Name"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2 w-full">
                Room
                <input
                  type="text"
                  value={localUserDetails?.phone_number}
                  onChange={(e) => {
                    setLocalUserDetails({
                      ...localUserDetails,
                      room: e.target.value,
                    });
                  }}
                  className="grow w-full"
                  placeholder="DR203"
                />
              </label>
            </div>
            <div className="w-full">
              <button
                className="btn hover:bg-green-300 bg-green-200 w-full"
                onClick={() => {
                  uploadUserDetails();
                }}
              >
                <IconCheckbox size={24} stroke={2} />
                Update Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
