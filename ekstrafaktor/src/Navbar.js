import React from 'react';
import './Navbar.css';
import Search from './Search';
import SignInUpButton from './SignInUpH';
import { Link, useLocation } from 'react-router-dom';

const Navbar = (props) => {
  const location = useLocation();
  const hideNavbarPaths = ['/Signin'];

  if (hideNavbarPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">
            <h1>Ekstrafaktor</h1>
          </Link>
        </li>
        <li>
          <Link to="/">Dagens Kamper</Link>
        </li>
        <li>
          <Link to="/Spilte_kamper">Spilte kamper</Link>
        </li>
        <li>
          <Link to="/Avgjorende_skader">Avgjørende Skader</Link>
        </li>
        <li>
          <Search 
            query={props.query}
            setQuery={props.setQuery}
            location={location}
            selectedDate={props.selectedDate}
             />
        </li>
        <li>
          <Link to="/Signin"><SignInUpButton /></Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;