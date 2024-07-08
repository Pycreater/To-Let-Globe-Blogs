import "../navbar/navbar.css"
import logo from "../../assets/logo.png"

import { Link } from "react-router-dom"; //Imported link

export default function NavBar() {
  return (
    <div className='top'>
      <div className="topLeft">
      <a className="navbar-brand" href="/"><img src={logo} alt="Logo" /></a>
      </div>
      {/* <div className="topCenter">c</div> */}
      <div className="topRight">
      <Link to="/" className="navbar-link">Home</Link>
      <Link to="/" className="navbar-link">Service</Link>
      <Link to="/blog" className="navbar-link">Blog</Link>
      <Link to="/" className="navbar-link">Contact</Link>
      <Link to="/" className="navbar-link">About</Link>
      <Link to="/" className="navbar-link">Property Listing</Link>
      </div>
    </div>
  )
}

