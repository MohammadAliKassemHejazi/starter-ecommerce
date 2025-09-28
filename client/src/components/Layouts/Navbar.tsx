import React, { useState } from "react";
import Navigation from './Navigation';


export default function Navbar() {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        className="toggle-btn"
        onClick={() => setIsNavigationOpen(!isNavigationOpen)}
        aria-label="Toggle sidebar"
      >
        <i className="fas fa-bars"></i>
      </button>
      
      {/* Sidebar Navigation */}
      <Navigation 
        isOpen={isNavigationOpen} 
        onClose={() => setIsNavigationOpen(false)} 
      />
    </>
  );
}