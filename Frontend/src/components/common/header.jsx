"use client";

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/components/auth/authContext";
import TeamLogo from "@/assets/TeamLogo.svg";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, HelpCircle, LogOut } from "lucide-react";
import {useAuth} from "../../hooks/useAuth"; // Import authentication hook

function ListItem({ className, title, children, href }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

ListItem.displayName = "ListItem";
ListItem.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};

export function Header() {
  const { user } = useAuth(); // Get authentication state
  const { logout } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const userName = user?.fullName;
  const userAvatar =
    user?.avatar ||
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiGH692JKGKQ6t9K1nxWdKRaDa8V387Yqe1w&s";

  useEffect(() => {
    setIsAuthenticated(!!user); // Update when user state changes
  }, [user]);

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="relative h-8 w-8 rounded-full bg-inherit">
          <Avatar className="h-9 w-9 bg-gray-300 hover:bg-gray-400 flex items-center justify-center">
            <AvatarImage
              src={"https://cdn-icons-png.flaticon.com/512/7996/7996254.png"}
              alt="chevron"
              className="h-6 w-6"
            />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mt-4" align="end">
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>FAQ</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600 cursor-pointer"
          onSelect={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <NavigationMenu className="w-full absolute top-[26px] left-0 h-[75px] bg-white shadow-md z-50 flex items-stretch px-6">
      <NavigationMenuList>
        <NavigationMenuItem className="flex items-center">
          <div className="flex items-center justify-center h-full">
            <Link to="/">
              <img
                src={TeamLogo}
                alt="Team Logo"
                className="w-[51px] h-[48px] py-1 ml-[20px] mr-[25px]"
              />
            </Link>
          </div>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Online Consultation</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6  md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3 justify-center items-center">
                <NavigationMenuLink asChild>
                  <Link
                    className="flex h-full w-full select-none flex-col justify-center rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      TrustTalk
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Let us be here to listen and support you everyday
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="#" title="View Schedule">
                Look for online schedule
              </ListItem>
              <ListItem href="#" title="Psychologist Profile">
                View list of our best psychologist
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Service Package</NavigationMenuTrigger>
          <NavigationMenuContent className="absolute bg-white shadow-lg z-50">
            <ul className="grid w-[250px] h-full p-2 cursor-pointer">
              <ListItem href="#" title="Free Tier" className="m-1">
                Perfect for new user to try
              </ListItem>
              <ListItem
                href="#"
                title="VIP Tier"
                className="bg-[#1F45FF] text-white m-1"
              >
                <p className="text-white transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  Designed for those seeking premium and expert support
                </p>
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={`${navigationMenuTriggerStyle()} cursor-pointer text-black`}
          >
            <Link to="/manage-posts" className="text-black">
              Blogs
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={`${navigationMenuTriggerStyle()} cursor-pointer text-black`}
          >
            Test Mental Health
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      {/* Right - Login & Sign Up Buttons */}
      <div className="flex gap-3 items-center justify-between ml-auto mr-4">
        {isAuthenticated ? (
          <div className="flex flex-row items-center gap-2">
            <p className="flex items-center mr-1 font-semibold">
              {user.fullName}
            </p>
            <Avatar className="h-9 w-9">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <UserMenu userAvatar={user.avatar} userName={user.fullName} />
          </div>
        ) : (
          <>
            <Link to="/login">
              <Button variant="outline" className="px-4 py-2">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                variant="default"
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </NavigationMenu>
  );
}

Header.propTypes = {
  isAuthenticated: PropTypes.bool,
  userAvatar: PropTypes.string,
  userName: PropTypes.string,
};

export default Header;
