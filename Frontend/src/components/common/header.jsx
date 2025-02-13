"use client";

import TeamLogo from "../../assets/TeamLogo.svg";
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

function ListItem({ className, title, children, href }) {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    href={href}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}>
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</div>
                </a>
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
                                    <a
                                        className="flex h-full w-full select-none flex-col justify-center rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        href="/">
                                        <div className="mb-2 mt-4 text-lg font-medium">TrustTalk</div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            Let us be here to listen and support you everyday
                                        </p>
                                    </a>
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
                            <ListItem href="#" title="VIP Tier" className="bg-[#1F45FF] text-white m-1">
                                <p className="text-white transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                                    Designed for those seeking premium and expert support
                                </p>
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} cursor-pointer text-black`}>
                        Blogs
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink className={`${navigationMenuTriggerStyle()} cursor-pointer text-black`}>
                        Test Mental Health
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
            {/* Right - Login & Sign Up Buttons */}
            <div className="flex gap-3 items-center justify-between ml-auto">
                <Link to="/login">
                    <Button variant="outline" className="px-4 py-2">
                        Login
                    </Button>
                </Link>
                <Link to="/signup">
                    <Button variant="default" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700">
                        Sign Up
                    </Button>
                </Link>
            </div>
        </NavigationMenu>
    );
}

export default Header;
