import React, { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import { NavLink, Link, useHistory } from "react-router-dom";

const NavBar = () => {

  let { user, setUser } = useContext(UserContext);
  let history = useHistory();

  function handleLogoutClick(){
    fetch("/logout", {
      method: "DELETE"
    }).then((r) => {
      if (r.ok) {
        setUser(null)
      }
    },[]);
  }

  function handleHome(){
    history.push('/home')
  }

  return (
    <div id="NavBar">
      {!user ? (
        <h3>
          <span id="WebsiteTitle">Splitsy</span> | An App to Split Expenses
        </h3>
      ): (
        <h3>
        <span id="WebsiteTitle" onClick={handleHome}>Splitsy</span> | An App to Split Expenses
        </h3>
      )}

      {!user ? (<div></div>) : (
        <div id="Routes-Welcome">
          <h1 id="WelcomeUser"> Hello, {user.first_name}! </h1>
          <div className="dropdown">
            <button id="NavBarDropdownBtn">Menu</button>
              <nav id="NavBarRoutes">
                <NavLink className="NavRoute" exact to="/home">My Bills</NavLink>
                <NavLink className="NavRoute" exact to="/items-owed">Items Owed</NavLink>
                <NavLink className="NavRoute" exact to="/profile">Profile</NavLink>
                <NavLink className="NavRoute" exact to="/" onClick={handleLogoutClick}>Logout</NavLink>
              </nav>
          </div>
        </div>
      )}
    </div>
  )
}

export default NavBar;