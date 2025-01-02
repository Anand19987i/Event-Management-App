import React from 'react'

const Optionbar = () => {
  return (
    <div className='flex h-12 gap-8 bg-gray-200 items-center font-montserrat'>
      <span className='ml-20 font-medium text-sm'>Events</span>
      <span className='font-medium text-sm'>Streams</span>
      <span className='font-medium text-sm'>Movies</span>
      <span className='font-medium text-sm'></span>
    </div>
  )
}

export default Optionbar
