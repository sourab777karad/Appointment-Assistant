import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Input,
} from "@material-tailwind/react";
import {
  BiCalendar,
  BiCalendarCheck,
  BiUser,
  BiBell,
  BiSearch,
} from "react-icons/bi";
import logo from "../assets/logo.png";

function NavbarWithSearch({ isNavbarPresent }) {
  const [openNav, setOpenNav] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Notification 1" },
    { id: 2, text: "Notification 2" },
    { id: 3, text: "Notification 3" },
    { id: 4, text: "Notification 1" },
    { id: 5, text: "Notification 2" },
    { id: 6, text: "Notification 3" },
  ]);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  if (!isNavbarPresent) {
    return null;
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
        className="flex items-center gap-x-2 p-1 font-medium relative"
      >
        <BiBell size={25} />
        <div className="flex items-center">
          <Button
            size="sm"
            onClick={handleNotificationClick}
            ripple="light"
            className="bg-white text-black"
          >
            Notifications
          </Button>
          {showNotifications && (
            <div className="absolute left-0 mt-2 w-72 h-full rounded-lg shadow-lg bg-white z-50">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    {notification.text}
                  </Typography>
                </div>
              ))}
            </div>
          )}
        </div>
      </Typography>
    </ul>
  );

  return (
    <div className="fixed top-0 w-full z-50">
      <Navbar className="mx-auto max-w-[90%] py-2 lg:py-4">
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
              />
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
                className="!border-t-blue-gray-300 pl-9 placeholder:text-blue-gray-300 focus:!border-blue-gray-300"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <div className="absolute left-3 top-[13px]">
                <BiSearch size={20} />
              </div>
            </div>
            <Button size="md" className="rounded-lg">
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
    </div>
  );
}

export default NavbarWithSearch;
