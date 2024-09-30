import React from 'react';
import Link from 'next/link'
import { useSession, signOut } from "next-auth/react"

const Navigation = () => {
  return (
    <nav className="navigation">
      <ul className="nav-links">
        <li><Link href="/dashboard" className="btn btn-link">Dashboard</Link></li>
        <li><button onClick={() => signOut()} className="btn btn-link">Sign out</button></li>
      </ul>
    </nav>
  );
};

export default Navigation;
