import React, { useState } from "react";
import Link from 'next/link';

const AdminNavBar = () => {
  const navItems = [
    {name: 'Home', href: '/admin'},
    {name: 'Schedule', href: '/admin/schedule'},
    {name: 'Managment', href: '/admin/managment'},
    {name: 'Statistics', href: '/admin/statistics'}
  ]
  return(
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
      <div className="flex items-center space-x-6">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <span className="text-gray-300 hover:text-white cursor-pointer">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
};


export default AdminNavBar;
