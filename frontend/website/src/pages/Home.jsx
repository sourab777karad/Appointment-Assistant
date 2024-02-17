import { Link } from "react-router-dom";
import Carousel from "../components/MyCarousel";
import { Button } from "@material-tailwind/react";
import "../pages/style.css";

const Home = () => {
  return (
    <div className="relative">
      <div className="flex w-full p-auto m-auto items-center">
        <div className="ml-12 mt-24 w-[40%] h-[40%] rounded-xl mr-4">
          <Carousel />
        </div>

        <div className="m-auto p-auto flex justify-center w-[50%]">
          <div className="flex flex-col">
            <Link to="/Appointment-user">
              <Button className="text-[16px] w-[400px] h-[100px] border-2 border-black bg-green-400 mt-20 rounded-2xl">
                My Appointments
              </Button>
            </Link>
            <Link to="/Appointment-past">
              <Button className="text-[16px] w-[400px] h-[100px] border-2 border-black bg-red-400 mt-8 rounded-2xl">
                Previous Appointments
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex relative w-[90vw] h-[100vh] mt-2 m-auto p-auto">
        <div className="m-auto p-auto items-center">
          <table className="neumorphic">
            <thead>
              <tr>
                <th>Time</th>
                <th>Appointee</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cell 1</td>
                <td>Cell 2</td>
              </tr>
              <tr>
                <td>Cell 1</td>
                <td>Cell 2</td>
              </tr>
              <tr>
                <td>Cell 1</td>
                <td>Cell 2</td>
              </tr>
              <tr>
                <td>Cell 1</td>
                <td>Cell 2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
