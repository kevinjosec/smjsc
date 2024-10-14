import React from 'react'
import './events.css'
import Navbar from '../navbar/navbar'

const events = () => {
  return (
    <div className='events-container'>
      <div className="events-sub-container">
        <Navbar />
        <div className="events-header-container">
          <div className="events-header">EVENTS</div>
          <div className="events-header-content">Risen seeks to actively engage our community with fellowship and love. Below you will find a list of events that you can attend, volunteer and share with others.</div>
        </div>
      </div>
      <div className="upcoming-events">Upcoming events</div>
    </div>
  )
}

export default events
