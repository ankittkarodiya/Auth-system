import React from 'react'
import { getData } from '../context/userContext'

const ProtectedRoute = () => {

    const {user} = getData();

  return (
    <div>
      
    </div>
  )
}

export default ProtectedRoute
