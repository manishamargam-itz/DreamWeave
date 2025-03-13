import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const Navbar = () => {
    const { user, setShowLogin, logout, credit } = useContext(AppContext);
    const navigate = useNavigate();

    const handleCreditCheck = () => {
        if (credit === 0) {
            toast.warn("No images can be generated as credits are 0.");
            setTimeout(() => {
                navigate('/buy'); // Redirect to buy page after showing the message
            }, 2000);
         }
    };

    return (
        <div className='flex items-center justify-between py-4'>
            <Link to='/'>
                <img 
                    src={assets.logo || '/fallback-logo.png'} 
                    alt="Logo" 
                    className='w-28 sm:w-32 lg:w-40' 
                />
            </Link>
            <div>
                {
                    user ? 
                    <div className='flex items-center gap-2 sm:gap-3'>
                        <button 
                            onClick={() => navigate('/buy')}
                            className="flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-700"
                        >
                            <img 
                                className='w-5' 
                                src={assets.credit_star || '/fallback-star.png'} 
                                alt="Credit Star" 
                            />
                            <p className='text-xs sm:text-sm font-medium text-gray-600'>
                                Credit left: {credit}
                            </p>
                        </button>

                        <p className='text-gray-600 max-sm:hidden pl-4'>Hi, {user.name}</p>
                        <div className='relative group'>
                            <img src={assets.profile_icon} className='w-10 drop-shadow' alt="Profile" />
                            <div className='absolute hidden group-hover:block top-0 left-0 text-black rounded pt-12'>
                                <ul className='p-2 bg-white rounded-md text-sm'>
                                    <li onClick={logout} className='py-1 px-2 cursor-pointer'>Logout</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='flex items-center gap-2 sm:gap-5'>
                        <p 
                            onClick={() => navigate('/buy')} 
                            className='cursor-pointer'
                        >
                            Pricing
                        </p>
                        <button 
                            onClick={() => setShowLogin(true)}
                            className='bg-zinc-800 text-white px-7 py-2 sm:px-10 text-sm rounded-full hover:bg-zinc-700 transition-all'
                        >
                            Login
                        </button>
                    </div>
                }
            </div>
        </div>
    );
}

export default Navbar;
