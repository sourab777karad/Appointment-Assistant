import React from "react";
import logo from "../assets/logo.png";
import {
	IconBrandWhatsapp,
	IconMail,
	IconPhoneCall,
	IconUserCode,
} from "@tabler/icons-react";

export default function Footer() {
	return (
		<footer className="footer p-10 bg-gray-300">
			<aside>
				<img src={logo} className="w-24 h-24" />
				<p className="text-gray-700 p-4">
					Appointment Assistant
					<br />
					Made to facilitate appointment making throughout MIT World
					Peace University.
				</p>
			</aside>
			<nav>
				<h6 className="footer-title text-gray-800">Social</h6>
				<div className="flex gap-4 my-4">
					<IconBrandWhatsapp className="w-6 h-6" />
					<IconMail className="w-6 h-6" />
				</div>
			</nav>
			<nav>
				<h6 className="footer-title text-gray-800">About Developers</h6>
				<div className="flex flex-col gap-4 my-4">
					<div
						className="flex gap-2 cursor-pointer hover:underline"
						onClick={() =>
							window.open(
								"https://www.linkedin.com/in/parth-zarekar/",
								"_blank"
							)
						}
					>
						<IconUserCode className="w-6 h-6" /> Krishnaraj Thadesar
					</div>
					<div
						className="flex gap-2 cursor-pointer hover:underline"
						onClick={() =>
							window.open(
								"https://www.linkedin.com/in/parth-zarekar/",
								"_blank"
							)
						}
					>
						<IconUserCode className="w-6 h-6" /> Parth Zarekar
					</div>
					<div
						className="flex gap-2 cursor-pointer hover:underline"
						onClick={() =>
							window.open(
								"https://www.linkedin.com/in/parth-zarekar/",
								"_blank"
							)
						}
					>
						<IconUserCode className="w-6 h-6" /> Sourab Karad
					</div>
					<div
						className="flex gap-2 cursor-pointer hover:underline"
						onClick={() =>
							window.open(
								"https://www.linkedin.com/in/parth-zarekar/",
								"_blank"
							)
						}
					>
						<IconUserCode className="w-6 h-6" /> Saubhagya Singh
					</div>
				</div>
			</nav>
		</footer>
	);
}
