import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setRecommendEvents } from '@/redux/eventSlice';
import { EVENT_API_END_POINT } from '@/utils/constant';
import { MoveRight } from 'lucide-react';

const EventSuggestion = ({ close }) => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [deselectedEvents, setDeselectedEvents] = useState([]);

  const eventCategories = [
    { name: 'Concert', img: 'concert.jpg' },
    { name: 'Theater', img: 'theatre.jpg' },
    { name: 'Workshop', img: 'workshop.avif' },
    { name: 'Seminar', img: 'seminar.webp' },
    { name: 'Exhibition', img: 'exhibition.avif' },
    { name: 'Stand Up', img: 'standup.jpg' },
    { name: 'Webinar', img: 'webinar.webp' },
    { name: 'Art Showcase', img: 'art.avif' },
    { name: 'Sport Events', img: 'sport.avif' },
  ];

  const handleSelection = (category) => {
    setSelectedEvents(prev => {
      if (prev.includes(category)) {
        setDeselectedEvents(prev => [...prev, category]);
        return prev.filter(c => c !== category);
      }
      setDeselectedEvents(prev => prev.filter(c => c !== category));
      return [...prev, category];
    });
  };

  useEffect(() => {
    if (user?._id && (selectedEvents.length > 0 || deselectedEvents.length > 0)) {
      const fetchRecommendations = async () => {
        try {
          const response = await axios.post(
            `${EVENT_API_END_POINT}/events/recommendation/${user._id}`,
            {
              selectedTypes: selectedEvents,
              deselectedTypes: deselectedEvents
            }
          );
          dispatch(setRecommendEvents(response.data.events));
        } catch (error) {
          console.error('Recommendation error:', error);
        }
      };
      fetchRecommendations();
    }
  }, [selectedEvents, deselectedEvents, user, dispatch]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-xl w-11/12 md:w-2/3 p-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Help Us Recommend Better Events!
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {eventCategories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleSelection(category.name)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedEvents.includes(category.name)
                  ? 'bg-blue-100 border-2 border-blue-500 scale-105'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <img
                src={category.img}
                alt={category.name}
                className="h-16 w-16 mx-auto mb-3 rounded-lg object-cover"
              />
              <p className="text-center text-sm font-semibold text-gray-700">
                {category.name}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={close}
          className="absolute right-6 bottom-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <MoveRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default EventSuggestion;