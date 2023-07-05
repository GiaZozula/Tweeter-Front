import React, {useState} from "react";
import SearchIcon from "@mui/icons-material/Search";
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";
import UserPlaceholder from "../UserPlaceholder/UserPlaceholder";
import {useLocation} from "react-router-dom";

const Navbar = () => {
    const [userData, setUserData] = useState(null);
    const location = useLocation().pathname;

    //setting up 4 columns, 2 for the center with one on each side (for logo and search bar)
    return (
    <div className="grid grid-cols-1 md:grid-cols-4 my-5 justify-center">
        <div className="max-auto md:mx-0">
            <img src="/twitter-logo.png" alt="Twitter Logo" width={"40px"} className="ml-8"/>
        </div>
        {/* col-span-2 spans the two columns in the center */}
        <div className="col-span-2 md:border-x-2 md:border-slate-200 md:px-6 my-6 md:my-0">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-2xl">
            {location.includes("profile") ? (
              <UserPlaceholder setUserData={setUserData} userData={userData} />
            ) : location.includes("explore") ? (
              "Explore"
            ) : (
              "Home"
            )}
          </h2>
          <StarBorderPurple500Icon />
            </div>
        </div>

        <div className="px-0 md:px-6 mx-auto">
            {/* absolute goes into parent element and gives margin of 2 */}
            <SearchIcon className="absolute m-2" />
            <input type="text" className="bg-blue-100 rounded-full py-2 px-8" />
        </div>
    </div>
    );
};

export default Navbar;
