import React from 'react'
import { Link } from 'react-router-dom'

// The Header creates links that can be used to navigate
// between routes.
const Header = () => (
<header>
<nav>
<ul>
<li><Link to='/'>Home</Link></li>
<li><Link to='/user/admin'>Create Admin</Link></li>
<li><Link to='/user/create'>Create User</Link></li>
<li><Link to='/transaction/query'>Transaction</Link></li>
</ul>
</nav>
</header>
)
export default Header
