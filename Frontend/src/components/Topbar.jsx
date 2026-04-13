import { useState } from "react";
import { Link, NavLink, useNavigate } from 'react-router-dom';

function Topbar(){
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('/signin');
      window.location.reload(); // Optional: to ensure the state clears globally if no Context is used
    };
    const [isOpen, setIsOpen] = useState(false);
    
    return <>
       <header className="mt-0 bg-white shadow-md sticky top-0 z-50">
        <div className="flex justify-between items-center h-17 px-1">
        <div className="h-16 flex items-center">
            <div className=""> <Link to='/'>
                <img src="/car.jpg" className=" ml-5 bg-white rounded h-15 flex " alt="car image"/>
            </Link>
            </div>
            <div className="cursor-pointer">
               <p className="pl-1 font-semibold text-xl"><Link to='/'>TravelMate</Link></p>
               <p className="pl-1 font-semibold text-sm text-orange-600 "><Link to='/'>Rental service</Link></p>
            </div>
        </div>

        <nav className="hidden md:flex  lg:space-x-10 md:space-x-7 font-semibold">
          <NavLink to='/' className={({ isActive }) => isActive ? "text-orange-600" : "hover:text-orange-600"}>Home</NavLink>
          <NavLink to='/about' className={({ isActive }) => isActive ? "text-orange-600" : "hover:text-orange-600"}>About</NavLink>
          <NavLink to='/vehicle' className={({ isActive }) => isActive ? "text-orange-600" : "hover:text-orange-600"}>Vehicle Models</NavLink>
          <NavLink to='/contact' className={({ isActive }) => isActive ? "text-orange-600" : "hover:text-orange-600"}>Contact</NavLink>
        </nav>

        <div className="md:flex hidden h-14 items-center space-x-4  ">
            <ul className="flex gap-7">
            {token ? (
              <>
                <NavLink to='/history' className={({ isActive }) => isActive ? "text-orange-600 py-2 font-semibold" : "hover:text-orange-600 py-2 font-semibold"}>My Bookings</NavLink>
                <NavLink to='/inspect' className={({ isActive }) => isActive ? "text-orange-600 py-2 font-semibold bg-emerald-50 px-3 rounded text-emerald-700" : "hover:text-orange-600 py-2 font-semibold bg-emerald-50 px-3 rounded text-emerald-700 hover:bg-emerald-100"}>Damage Scan</NavLink>
                <NavLink to='/verify' className={({ isActive }) => isActive ? "text-orange-600 py-2 font-semibold bg-indigo-50 px-3 rounded text-indigo-700" : "hover:text-orange-600 py-2 font-semibold bg-indigo-50 px-3 rounded text-indigo-700 hover:bg-indigo-100"}>AI Verify</NavLink>
                <button onClick={handleLogout} className="hover:text-orange-600 py-2 font-semibold cursor-pointer">Logout</button>
              </>
            ) : (
              <>
                <Link to='/signin' className="hover:text-orange-600 py-2 font-semibold">Signin</Link>
                <Link
                  to='/register'
                  className="font-semibold ml-4 mr-7 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 shadow-sm hover:shadow-md"
                >
                  Register
                </Link>
              </>
            )}
            </ul>
        </div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex justify-end p-2 text-gray-700 focus:outline-none"
        >
          ☰
        </button>
        </div>

      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-4">
          <nav className="flex flex-col space-y-2 font-semibold">
            <NavLink to='/' onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? "text-orange-600" : "hover:text-orange-600"}>Home</NavLink>
            <NavLink to='/about' onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? "text-orange-600" : "hover:text-orange-600"}>About</NavLink>
            <NavLink to='/vehicle' onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? "text-orange-600" : "hover:text-orange-600"}>Vehicle Models</NavLink>
            <NavLink to='/contact' onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? "text-orange-600" : "hover:text-orange-600"}>Contact</NavLink>
          </nav>
          <div className="flex flex-col space-y-2">
            {token ? (
              <>
                <NavLink to="/history" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? "text-orange-600 font-semibold text-center mt-2" : "hover:text-orange-600 font-semibold text-center mt-2"}>My Bookings</NavLink>
                <NavLink to="/inspect" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? "text-orange-600 font-semibold text-center mt-2 bg-emerald-50 py-1" : "hover:text-orange-600 font-semibold text-center mt-2 bg-emerald-50 py-1"}>Damage Scan</NavLink>
                <NavLink to="/verify" onClick={() => setIsOpen(false)} className={({ isActive }) => isActive ? "text-orange-600 font-semibold text-center mt-2 bg-indigo-50 py-1" : "hover:text-orange-600 font-semibold text-center mt-2 bg-indigo-50 py-1"}>AI Verify</NavLink>
                <button 
                  onClick={handleLogout} 
                  className="font-semibold px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 shadow-sm hover:shadow-md text-center cursor-pointer mt-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="hover:text-orange-600 font-semibold text-center mt-2">Signin</Link>
                <Link
                  to='/register'
                  className="font-semibold px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-500 shadow-sm hover:shadow-md text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
      </header>
    </>
}

export default Topbar;