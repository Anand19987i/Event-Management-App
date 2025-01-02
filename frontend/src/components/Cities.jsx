import { Search } from 'lucide-react';
import { MdGpsFixed } from 'react-icons/md';
import React, { useState } from 'react';

const Cities = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showAllCities, setShowAllCities] = useState(false);

    const cities = ["Mumbai", "Delhi NCR", "Bengaluru", "Hyderabad", "Ahmedabad", "Chandigarh", "Pune", "Chennai", "Kolkata", "Kochi"];
    const allCities = [
        "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Visakhapatnam", "Indore", "Thane", "Bhopal", "Patna", 
        "Vadodara", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Varanasi", "Srinagar", 
        "Aurangabad", "Dhanbad", "Amritsar", "Jodhpur", "Raipur", "Kota", "Guwahati", "Ranchi", "Howrah", 
        "Coimbatore", "Vijayawada", "Gwalior", "Jabalpur", "Madurai", "Tiruchirappalli", "Salem", "Warangal", 
        "Mysuru", "Hubli-Dharwad", "Bareilly", "Moradabad", "Aligarh"
    ];

    const filteredCities = cities.filter(city => city.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="mx-auto my-10 w-10/12 p-4 rounded-md shadow-sm font-montserrat bg-white absolute">
            <div className="flex border bg-white items-center p-2 w-full">
                <Search className="text-gray-600 h-5" />
                <input
                    type="text"
                    placeholder="Search for your city"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="outline-none py-1 px-3 w-full text-sm"
                    
                />
            </div>
            <div className="flex items-center gap-2 text-red-500 p-3 cursor-pointer hover:text-red-600">
                <MdGpsFixed className="text-lg" />
                <span className="text-sm">Detect my location</span>
            </div>
            <hr />
            <div className="flex my-4 justify-center">
                <span className="font-bold">Popular Cities</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 my-3">
                {filteredCities.map((city, idx) => (
                    <div key={idx} className="text-center font-medium text-sm cursor-pointer">
                        {city}
                    </div>
                ))}
            </div>
            <div className='text-center text-red-500'>
                <span
                    className='font-medium cursor-pointer'
                    onClick={() => setShowAllCities(!showAllCities)}
                >
                    {showAllCities ? "Hide All Cities" : "View All Cities"}
                </span>
            </div>
            {showAllCities && (
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 my-3'>
                    {allCities.map((city, idx) => (
                        <div key={idx} className='text-center font-light text-sm cursor-pointer hover:font-normal'>
                            {city}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Cities;
