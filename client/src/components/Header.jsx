import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext';

const Header = () => {
const {userData} = useContext(AppContext);

  return (
    <div className='flex flex-col items-center m-20 px-4 text-center text-gray-800'>
        <h1 className='flex items-center gap-2 text-xt sm:text-3xl font-medium mb-2'>Hello,{userData ? userData.name : 'Developer'} !
             <img src={assets.hand_wave} alt="" className='w-8 aspect-square' /></h1>
        <h2 className='text-3xl sm:text-5xl font-semibold mb-2'>Welcome to the app</h2>
        <p className='mb-8 max-w-md'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum accusamus optio saepe vero, maiores error? Unde ratione hic omnis ex.</p>
        <button className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all'>Get Started</button>
    </div>
  )
}

export default Header;