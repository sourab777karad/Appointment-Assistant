import { useLocation } from "react-router-dom";
import DayDetailsTable from "../components/DayDetailsTable";

export default function DayDetails() {
  const location = useLocation();
  console.log(location);
  const given_date = location.state.date;
  const given_day = location.state.day;

  return (
    <div className="pt-24 px-8">
      <div>
        <div>
          <h1 className="text-3xl font-semibold text-center mt-4 text-blue-800">
            Scheduled Appointments for {given_day}, {given_date}
          </h1>
        </div>
      </div>
      <DayDetailsTable given_date={given_date} />
    </div>
  );
}
