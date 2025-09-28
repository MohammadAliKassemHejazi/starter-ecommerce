import React from "react";
import Link from "next/link";

type Props = {};

export default function Footer({}: Props) {
  return (
    <footer className="modern-footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo">
              <i className="fas fa-cube"></i>
              <span>NexusAdmin</span>
            </div>
            <p className="footer-description">
              Modern e-commerce platform with advanced admin capabilities and multi-tenant architecture.
            </p>
            <div className="footer-social">
              <a href="https://github.com/MohammadAliKassemHejazi" className="social-link" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-discord"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-title">Platform</h4>
              <ul className="footer-list">
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><Link href="/shop">Shop</Link></li>
                <li><Link href="/orders">Orders</Link></li>
                <li><Link href="/analytics">Analytics</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-title">Management</h4>
              <ul className="footer-list">
                <li><Link href="/users">Users</Link></li>
                <li><Link href="/products">Products</Link></li>
                <li><Link href="/categories">Categories</Link></li>
                <li><Link href="/store">Stores</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-title">Support</h4>
              <ul className="footer-list">
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/docs">Documentation</Link></li>
                <li><Link href="/contact">Contact Us</Link></li>
                <li><Link href="/status">System Status</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-title">Account</h4>
              <ul className="footer-list">
                <li><Link href="/profile">Profile</Link></li>
                <li><Link href="/settings">Settings</Link></li>
                <li><Link href="/plans">Plans</Link></li>
                <li><Link href="/billing">Billing</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; 2024 Mohammad Hijazi. All rights reserved.</p>
            <p className="footer-version">Version 2.0.0</p>
          </div>
          
          <div className="footer-legal">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/cookies">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
