'use client'

import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import './dashboard.css'

export default function DashboardLayout({ children,}: {children: React.ReactNode}) {
  const { data: session } = useSession()

  return (
    <>
      <header className="navbar sticky-top bg-dark flex-md-nowrap p-0 shadow" data-bs-theme="dark">
        <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 text-white" href="#"><i>bitwin.us</i></a>
        <span className="navbar-brand col-md-3 col-lg-2 me-0 px-3 text-white">{session?.user?.email}</span>
        <ul className="navbar-nav flex-row d-md-none">
          <li className="nav-item text-nowrap">
            <button className="nav-link px-3 text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSearch" aria-controls="navbarSearch" aria-expanded="false" aria-label="Toggle search">
              {/* <svg class="bi"><use xlink:href="#search"/></svg> */}
            </button>
          </li>
          <li className="nav-item text-nowrap">
            <button className="nav-link px-3 text-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
              {/* <svg class="bi"><use xlink:href="#list"/></svg> */}
            </button>
          </li>
        </ul>

        <div id="navbarSearch" className="navbar-search w-100 collapse">
          {/* <input class="form-control w-100 rounded-0 border-0" type="text" placeholder="Search" aria-label="Search"> */}
        </div>
      </header>

    <div className="container-fluid">
      <div className="row">
        <div className="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
          <div className="offcanvas-md offcanvas-end bg-body-tertiary" tabIndex={-1} id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="sidebarMenuLabel">Company name</h5>
              <button type="button" className="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto">
              
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center gap-2 active" aria-current="page" href="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link d-flex align-items-center gap-2" href="/dashboard/contracts">
                    Contracts
                    </Link>
                </li>
              </ul>

              <hr className="my-3" />

              <ul className="nav flex-column mb-auto">
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center gap-2" href="/dashboard/settings">
                    Settings
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/api/auth/signout" className="nav-link d-flex align-items-center gap-2"
                  onClick={(e) => {
                    e.preventDefault()
                    signOut({ callbackUrl: '/' })
                  }}
                  > Sign out
                </Link>
                </li>
              </ul>
          </div>
        </div>
        </div>
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        {children}
      </main>
    </div>
  </div>    
  </>
  )
}