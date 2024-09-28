import React from 'react';
import Link from 'next/link'

const Navigation = () => {
  return (
    <nav className="navigation">
      <ul className="nav-links">
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/logout">Log Out</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;
