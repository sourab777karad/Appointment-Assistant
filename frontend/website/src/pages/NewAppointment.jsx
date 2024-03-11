import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button, Input } from "@material-tailwind/react";

export default function NewAppointment() {
	return (
		<div>
			<div className="pt-24 flex flex-col">
				<h1 className="text-3xl font-semibold text-center mt-4 text-blue-800">
					Make New Appointment
        </h1>
        
        {/* div to select teachers, and to change week */}
        <div className="flex flex-row justify-between">
          
        </div>
			</div>
		</div>
	);
}
