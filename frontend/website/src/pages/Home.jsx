import Homesvg from "../assets/home.svg";
import "../pages/style.css";

const Home = () => {
	return (
		<div className="mt-24 flex flex-col gap-4">
			{/* first row */}
			<div className="flex flex-row justify-between mx-8 h-full">
				<div className="p-16">
					<div>
						<h2 className="text-7xl font-semibold text-blue-700">
							Welcome to Appointment Assistant
						</h2>
						<div className="text-4xl my-6">
							Effortless scheduling, limitless possibilities!
						</div>
					</div>
				</div>

				<div className="flex justify-center w-full h-full items-start pt-[10vh]">
					<img src={Homesvg} alt="home" className="w-[35vw]" />
				</div>
			</div>

			{/* second row */}
			<div className="flex flex-row justify-center">
				<div className="py-8">
					<div>
						<h2 className="text-5xl font-semibold text-blue-700 text-center mt-16">
							Your Upcoming Appointments
						</h2>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
