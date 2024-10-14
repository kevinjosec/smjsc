import React from 'react'
import Navbar from '../navbar/navbar'
import './teachers.css'

const teachers = () => {
    return (
        <div className='teachers-container'>
            <div className="teachers-sub-container">
                <Navbar />
                <div className="teachers-header-container">
                    <div className="teachers-header">TEACHERS</div>
                    <div className="teachers-header-content">Appointed vessels of divine truth, illuminate the path to spiritual enlightenment and deeper communion. They bear the sacred duty of nurturing souls with profound wisdom, forging a bond between heaven's wisdom and earthly hearts.</div>
                </div>
            </div>
        </div>
    )
}

export default teachers
