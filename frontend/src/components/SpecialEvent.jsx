import React from 'react'
import SpecialEventCards from './SpecialEventCards'

const SpecialEvent = ({event}) => {
  return (
    <div className='px-20  font-montserrat'>
         <h1 className='text-2xl font-bold p-3'>Top Special Events</h1>
        <SpecialEventCards/>
    </div>
  )
}

export default SpecialEvent
