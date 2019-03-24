import React from 'react'
import { NavLink } from 'react-router-dom'

import './Nav.css'

export default props =>
  <nav className='menu'>
    <ul className='menu__options'>
      <li className='menu__option'>
        <NavLink exact activeClassName='menu__link--active' className='menu__link' to='/'>Top</NavLink>
      </li>
      <li className='menu__option'>
        <NavLink activeClassName='menu__link--active' className='menu__link' to='/discover'>Populares</NavLink>
      </li>
      <li className='menu__option'>
        <NavLink activeClassName='menu__link--active' className='menu__link' to='/favorites'>Favoritos</NavLink>
      </li>
    </ul>
  </nav> 