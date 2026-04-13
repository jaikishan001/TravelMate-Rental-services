import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Basic auth check
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please sign in to view your bookings!");
      navigate("/signin");
      return;
    }

    // Retrieve and filter bookings
    try {
      const allBookings = JSON.parse(localStorage.getItem("vm_bookings") || "[]");
      // YOLO filter: only match this user's token
      const userBookings = allBookings.filter(b => b.userToken === token);
      setBookings(userBookings);
    } catch (e) {
      console.error("Error retrieving bookings", e);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Bookings</h1>
        <p className="text-gray-500 mb-8">View your current and past vehicle rentals.</p>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <div className="w-20 h-20 mx-auto mb-4 bg-orange-100 text-orange-500 flex items-center justify-center rounded-full">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-700">No bookings yet</h2>
            <p className="text-gray-500 mb-6">You haven't booked any vehicles yet. Let's get you on the road!</p>
            <button 
              onClick={() => navigate('/vehicle')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              Browse Vehicles
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
               <div key={b.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row transition hover:-translate-y-1 hover:shadow-md duration-300">
                 <div className="md:w-1/4 bg-gray-100 flex items-center justify-center min-h-[160px] p-4">
                   <div className="text-center font-bold text-gray-400">
                     <svg className="w-16 h-16 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M13 8h6a1 1 0 011 1v7h-7" /></svg>
                   </div>
                 </div>
                 
                 <div className="p-6 md:w-3/4 flex flex-col justify-between">
                   <div className="flex justify-between items-start mb-4">
                     <div>
                       <h3 className="text-xl font-bold text-gray-800">{b.vehicleName}</h3>
                       <p className="text-sm text-gray-500 mt-1 font-mono text-xs">Booking ID: #{b.id}</p>
                     </div>
                     <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-green-100 text-green-700">
                       {b.status}
                     </span>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                     <div className="flex items-start">
                       <span className="text-orange-500 font-bold mr-2 text-base">•</span>
                       <div>
                         <span className="block font-semibold text-gray-700">Pick-up</span>
                         <span className="block">{b.pickup.date}</span>
                         <span className="block text-xs">{b.pickup.location}</span>
                       </div>
                     </div>
                     <div className="flex items-start">
                       <span className="text-red-500 font-bold mr-2 text-base">•</span>
                       <div>
                         <span className="block font-semibold text-gray-700">Drop-off</span>
                         <span className="block">{b.dropoff.date}</span>
                         <span className="block text-xs">{b.dropoff.location}</span>
                       </div>
                     </div>
                   </div>
                   
                   <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                     <div className="text-gray-500 text-sm flex items-center">
                       <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                       {b.customer.fullName}
                     </div>
                     <div className="font-bold text-gray-800">
                       {b.vehiclePrice} <span className="text-xs text-gray-500 font-normal ml-2">via {b.paymentMethod.toUpperCase()}</span>
                     </div>
                   </div>
                 </div>
               </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
