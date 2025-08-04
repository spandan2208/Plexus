import React, { useState } from 'react';
import assets from '../assets/assets';
import './LoginPage.css'; //  create this CSS file

const LoginPage = () => {
  const [currState, setCurrState] = useState('Sign up');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const isFlipped = currState === 'Log in';

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]' />

      <div className="flip-container">
        <div className={`flipper ${isFlipped ? 'flipped' : ''}`}>

          {/* Sign Up Form */}
          <form className="form-card front">
            <h2 className='text-2xl font-medium flex justify-between items-center'>{currState}
              <img src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />
            </h2>

            <input onChange={(e) => setFullName(e.target.value)} value={fullName}
              type="text" className='form-input' placeholder='Full Name' required />

            <input onChange={(e) => setEmail(e.target.value)} value={email}
              type="email" placeholder='Email Address' required className='form-input' />

            <input onChange={(e) => setPassword(e.target.value)} value={password}
              type="password" placeholder='Password' required className='form-input' />

            {!isDataSubmitted && (
              <div className='flex items-center gap-2 text-sm text-gray-300'>
                <input type="checkbox" required />
                <p>Agree to terms of use and privacy policy</p>
              </div>
            )}

            <button type='submit' className='form-button'>Create Account</button>

            <p className='text-sm text-gray-300'>Already have an account?</p>
            <button type='button' className='text-sm text-blue-500 hover:underline'
              onClick={() => setCurrState('Log in')}>Log in</button>
          </form>

          {/* Login Form */}
          <form className="form-card back">
            <h2 className='text-2xl font-medium flex justify-between items-center'>{currState}
              <img src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />
            </h2>

            <input onChange={(e) => setEmail(e.target.value)} value={email}
              type="email" placeholder='Email Address' required className='form-input' />

            <input onChange={(e) => setPassword(e.target.value)} value={password}
              type="password" placeholder='Password' required className='form-input' />

            <button type='submit' className='form-button'>Login Now</button>

            <p className='text-sm text-gray-300'>Don’t have an account?</p>
            <button type='button' className='text-sm text-blue-500 hover:underline'
              onClick={() => setCurrState('Sign up')}>Sign up</button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;

