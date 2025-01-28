import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EVENT_API_END_POINT } from '@/utils/constant';
import SpecialEventCards from './SpecialEventCards';

const SearchResults = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Get the search query from URL params
    const query = new URLSearchParams(location.search).get('query');

    // Handle query change when user submits new query
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery) {
            navigate(`/search?query=${searchQuery}`); // Navigate with query to refresh the results
        }
    };

    useEffect(() => {
        const fetchResults = async () => {
            if (query) {
                setLoading(true);
                try {
                    const response = await axios.get(`${EVENT_API_END_POINT}/search/query/${query}`);
                    setResults(response.data);
                } catch (error) {
                    console.error('Error fetching search results:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchResults();
    }, [query]); // Fetch data when the query changes (either initially or from navigation)

    return (
        <div className="container">
            {/* Search Input Form */}
            <form
                onSubmit={handleSearchSubmit}
                className="mb-4 bg-gray-100 p-10 flex justify-center items-center"
            >
                <div className="flex gap-2 items-center w-1/2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Type to search for events, workshops, and more..."
                        className="p-4 outline-none border border-gray-300 rounded-md w-full" // Adjust width based on screen size
                    />
                    <button
                        type="submit"
                        className="px-6 py-4 bg-purple-600 text-white rounded font-semibold"
                    >
                        Search
                    </button>
                </div>
            </form>

            {/* Display loading or results */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className='p-6'>
                    <h2 className="text-xl font-semibold">
                        {query ? `Results for ${query}` : ''}
                    </h2>
                    <div className="mt-4 grid grid-cols-5">
                        {results.length > 0 ? (
                            results.map((event, index) => (
                                <div className="px-2 md:px-6" key={event._id}> {/* Adjust padding for different screen sizes */}
                                    <Link to={`/details/${event.eventTitle.replace(/\s+/g, '-')}/${event._id}`}>
                                        <SpecialEventCards event={event} />
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p>No events found.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
