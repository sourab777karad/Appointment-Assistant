import React from "react";

const Profile = () => {
  return (
    <div className="min-h-screen flex mt-16 items-center justify-center bg-gray-200">
      <div className="flex justify-between w-4/5 max-w-screen-xl gap-20">
        {/* Profile Information */}
        <div className="w-2/5">
          <div className="bg-gray-200 p-10 rounded-lg shadow-lg border border-gray-300">
            <div className="text-center mb-8">
              <img
                className="rounded-full h-24 w-24 mx-auto mb-4 border-4 border-gray-200"
                src="https://via.placeholder.com/150"
                alt="Profile"
              />
              <h2 className="text-xl font-bold">John Doe</h2>
              <p className="text-gray-600">Software Engineer</p>
            </div>
            <div className="gap-4">
              <div className="mb-4 neumorphic rounded-lg p-4 bg-white border border-gray-300">
                <h3 className="text-lg font-semibold mb-4">
                  Contact Information
                </h3>
                <p className="text-gray-600">
                  <span className="font-semibold">Email:</span>{" "}
                  johndoe@example.com
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Phone:</span> +1234567890
                </p>
              </div>
              <div className="neumorphic rounded-lg p-4 bg-white border border-gray-300">
                <h3 className="text-lg font-semibold mb-4">Address</h3>
                <p className="text-gray-600">
                  <span className="font-semibold">Street:</span> 123 Main St
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">City:</span> Anytown
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Country:</span> Exampleland
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Placeholder Div */}
        <div className="w-3/5 bg-gray-200 p-10 rounded-lg shadow-lg border border-gray-300"></div>
      </div>
    </div>
  );
};

export default Profile;
