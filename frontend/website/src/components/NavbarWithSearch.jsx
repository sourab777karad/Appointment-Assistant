import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Input,
} from "@material-tailwind/react";
import { BiCalendar, BiCalendarCheck, BiUser, BiBell } from "react-icons/bi"; // Importing icons from React Icons library
import logo from "../assets/logo.png";

export default function NavbarWithSearch({ setisNavbarPresent }) {
  const [openNav, setOpenNav] = useState(false);

  if (!setisNavbarPresent) {
    return <></>;
  }

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="flex items-center gap-x-2 p-1 font-medium"
      >
        <BiCalendar size={25} />
        <Link to="/appointment-user" className="flex items-center">
          Appointments
        </Link>
      </Typography>

      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="flex items-center gap-x-2 p-1 font-medium"
      >
        <BiCalendarCheck size={25} />
        <Link to="/appointment-past" className="flex items-center">
          Past Appointments
        </Link>
      </Typography>

      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="flex items-center gap-x-2 p-1 font-medium"
      >
        <BiUser size={25} />
        <Link to="/profile" className="flex items-center">
          Account
        </Link>
      </Typography>

      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="flex items-center gap-x-2 p-1 font-medium"
      >
        <BiBell size={25} />
        <a href="#" className="flex items-center">
          Notifications
        </a>
      </Typography>
    </ul>
  );

  return (
    <Navbar className="mx-auto max-w-[90%]  py-2  lg:py-4">
      <div className="container flex flex-wrap items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          className="mr-4 cursor-pointer py-1.5 font-medium"
        >
          <Link to="/home">
            <img
              className="p-0 m-0 scale-150"
              src={logo}
              height="50"
              width="50"
              alt="Logo"
            ></img>
          </Link>
        </Typography>

        <div className="hidden lg:block">{navList}</div>

        <div className="hidden items-center gap-x-2 lg:flex">
          <div className="relative flex w-full gap-2 md:w-max">
            <Input
              type="search"
              placeholder="Search"
              containerProps={{
                className: "min-w-[288px]",
              }}
              className=" !border-t-blue-gray-300 pl-9 placeholder:text-blue-gray-300 focus:!border-blue-gray-300"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <div className="!absolute left-3 top-[13px]"></div>
          </div>
          <Button size="md" className="rounded-lg ">
            Search
          </Button>
        </div>
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </IconButton>
      </div>
      {openNav && <div className="lg:hidden">{navList}</div>}
    </Navbar>
  );
}
