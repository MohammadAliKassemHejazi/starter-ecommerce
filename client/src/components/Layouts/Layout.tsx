import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import ThemeSwitcher from "../ThemeSwitcher";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="layout-container">
      <Navbar />
      <main className="main-content">
        {children}
        {/* Theme Switcher - You can move this to any page or component */}
        {/* <div className="theme-switcher-container position-fixed" style={{ top: '20px', right: '20px', zIndex: 1000 }}>
          <ThemeSwitcher />
        </div> */}
      </main>
      <Footer />
    </div>
  );
}
