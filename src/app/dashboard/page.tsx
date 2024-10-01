'use client'

import { withAuth } from '@/app/components/withAuth'

function DashboardPage() {

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Dashboard</h1>
      </div>
      <p>Welcome to your dashboard. This is a protected page.</p> 
    </>
  )
}

export default withAuth(DashboardPage)