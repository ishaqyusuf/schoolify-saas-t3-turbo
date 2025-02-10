"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, DollarSign, GraduationCap, Menu, Users } from "lucide-react";

import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/select";

export default function Header() {
  const navItems = [
    {
      href: "/students",
      label: "Students",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      href: "/transactions",
      label: "Transactions",
      icon: <DollarSign className="mr-2 h-4 w-4" />,
    },
    {
      href: "/class-rooms",
      label: "Class Rooms",
      icon: <BookOpen className="mr-2 h-4 w-4" />,
    },
    {
      href: "/staffs",
      label: "Staffs",
      icon: <GraduationCap className="mr-2 h-4 w-4" />,
    },
    {
      href: "/services",
      label: "Services",
      icon: <GraduationCap className="mr-2 h-4 w-4" />,
    },
    {
      href: "/billables",
      label: "Billables",
      icon: <GraduationCap className="mr-2 h-4 w-4" />,
    },
  ];
  const [currentTerm, setCurrentTerm] = React.useState("Fall 2023");
  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="">
            <h1
              id="headerTitle"
              className="text-2xl font-bold text-gray-900"
            ></h1>
          </div>
          <div className="flex items-center space-x-4">
            <Select onValueChange={setCurrentTerm} defaultValue={currentTerm}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fall 2023">Fall 2023</SelectItem>
                <SelectItem value="Spring 2024">Spring 2024</SelectItem>
                <SelectItem value="Summer 2024">Summer 2024</SelectItem>
              </SelectContent>
            </Select>
            {/* Mobile Navigation Dropdown */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {navItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center">
                        {item.icon}
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        {/* Desktop Navigation Menu */}
        <nav className="mt-4 hidden md:block">
          <ul className="flex space-x-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
