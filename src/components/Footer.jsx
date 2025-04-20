import React from "react";
import { FaFacebookF, FaYoutube, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <div className="footer-container">
      <footer className="footer">
        <div className="footer-buttons">
          <button type="button" className="footer-button">
            <FaFacebookF />
          </button>
          <button type="button" className="footer-button">
            <FaYoutube />
          </button>
          <button type="button" className="footer-button">
            <FaInstagram />
          </button>
          <button type="button" className="footer-button">
            <FaTwitter />
          </button>
        </div>

        <div className="footer-text">
          ©Copyright. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Footer;
