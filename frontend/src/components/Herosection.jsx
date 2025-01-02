import React from 'react';
import Slider from 'react-slick';

const Herosection = () => {
  // Slick settings
  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Loop back to the first image after the last one
    speed: 500, // Transition speed
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    autoplay: true, // Automatically slide
    autoplaySpeed: 2000, // Delay between automatic slides (2 seconds)
    centerMode: true, // Enable center mode
    centerPadding: '20%', // Show a portion of the next/previous slides
  };

  return (
    <div className="flex justify-center items-center mt-10 overflow-hidden bg-white">
      <div className="w-full relative"> {/* Adjust width based on screen size */}
        <Slider {...settings} className="w-full">
          <div className="py-3 px-5 rounded-md">
            <img src="/b1.avif" alt="Image 1" className="w-full h-auto rounded-md mx-auto" />
          </div>
          <div className="py-3 px-5 rounded-md">
            <img src="/b2.avif" alt="Image 2" className="w-full h-auto rounded-md mx-auto" />
          </div>
          <div className="py-3 px-5 rounded-md">
            <img src="/b2.jpg" alt="Image 3" className="w-full h-auto rounded-md mx-auto" />
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default Herosection;
