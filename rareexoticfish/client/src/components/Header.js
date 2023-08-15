import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import Auth from '../utils/auth';

const Header = () => {
    const styles = {
        customHeader: {
            backgroundColor: 'black'
        },
        header1: {
            color: 'white'
        }
    }
    const [activeLink, setActiveLink] = useState('');

    function handleLinkClick(event) {
        event.PreventDefault();

        setActiveLink(event.target.innerText);
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light" style={styles.customHeader}>
                    <h1 className="storeTitle" style={styles.header1}>Rare Exotic Fish</h1>
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle Navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav">
                            <li className="nav-link mx-3" >
                                <Link to="/" className={activeLink === "Home" ? "nav-link active" : "nav-link"} onClick={() => handleLinkClick()} style={styles.header1}>Home</Link>
                            </li>
                            <li className="nav-link mx-3">
                                <Link to="/Livestock" className={activeLink === "Livestock" ? "nav-link active" : "nav-link"} onClick={() => handleLinkClick()} style={styles.header1}>Livestock</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Header