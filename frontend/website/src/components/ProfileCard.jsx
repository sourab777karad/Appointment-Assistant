import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Tooltip,
} from "@material-tailwind/react";
import { IconEdit } from "@tabler/icons-react";

export function ProfileCard({ userDetails, uploadProfilePicture }) {
  return (
    <Card className="w-96 p-4 bg-gradient-to-br from-blue-50 to-white h-[60vh]">
      <CardHeader
        floated={false}
        className="w-[25wh] h-[25vh] outline outline-4 aspect-square outline-blue-800 self-center rounded-full m-4 mb-2"
      >
        {userDetails?.profile_pic_url ? (
          <img
            src={
              userDetails?.profile_pic_url
                ? userDetails?.profile_pic_url
                : "https://source.unsplash.com/random"
            }
            alt="profile-picture"
            className="w-full h-full object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl font-bold text-blue-800">
            {userDetails?.full_name
              ?.split(" ")
              .map((name) => name[0])
              .join("")}
          </div>
        )}
      </CardHeader>
      <div
        className="flex justify-center items-center my-1 text-black hover:underline hover:cursor-pointer"
        onClick={() => {
          uploadProfilePicture();
        }}
      >
        Update{" "}
        <IconEdit className="w-6 h-6 self-center hover:cursor-pointer  hover:text-blue-800 hover:scale-110 transition-all duration-300 ease-in-out mx-1" />
      </div>
      <CardBody className="text-center">
        <Typography variant="h4" className="text-black mb-2">
          {userDetails?.full_name}
        </Typography>
        <Typography className="text-black font-medium" textGradient>
          {userDetails?.email}
        </Typography>
        <Typography className="text-black font-medium" textGradient>
          {userDetails?.room}
        </Typography>
      </CardBody>
      <CardFooter className="flex justify-center gap-7 pt-2">
        <Tooltip content="Like">
          <Typography
            as="a"
            href="#facebook"
            variant="lead"
            color="blue"
            textGradient
          >
            <i className="fab fa-facebook" />
          </Typography>
        </Tooltip>
        <Tooltip content="Follow">
          <Typography
            as="a"
            href="#twitter"
            variant="lead"
            color="light-blue"
            textGradient
          >
            <i className="fab fa-twitter" />
          </Typography>
        </Tooltip>
        <Tooltip content="Follow">
          <Typography
            as="a"
            href="#instagram"
            variant="lead"
            color="purple"
            textGradient
          >
            <i className="fab fa-instagram" />
          </Typography>
        </Tooltip>
      </CardFooter>
    </Card>
  );
}

import PropTypes from "prop-types";

ProfileCard.propTypes = {
  userDetails: PropTypes.shape({
    profile_pic_url: PropTypes.string,
    full_name: PropTypes.string,
    email: PropTypes.string,
    room: PropTypes.string,
  }),
  uploadProfilePicture: PropTypes.func.isRequired,
};
