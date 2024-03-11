import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Typography,
	Tooltip,
} from "@material-tailwind/react";

export function ProfileCard({ userDetails, uploadProfilePicture }) {
	return (
		<Card className="w-96 p-4 bg-gradient-to-br from-gray-300 to-white">
			<CardHeader
				floated={false}
				className="w-2/3 outline outline-4 aspect-square outline-blue-800 cursor-pointer self-center rounded-full m-4"
			>
				<div className="tooltip" data-tip="hello">
					<img
						src={
							userDetails?.profile_pic_url
								? userDetails?.profile_pic_url
								: "https://source.unsplash.com/random"
						}
						alt="profile-picture"
						onClick={() => {
							uploadProfilePicture();
						}}
						className="w-full h-full object-cover rounded-t-lg"
					/>
				</div>
			</CardHeader>
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
					<Typography as="a" href="#facebook" variant="lead" color="blue" textGradient>
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
					<Typography as="a" href="#instagram" variant="lead" color="purple" textGradient>
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
