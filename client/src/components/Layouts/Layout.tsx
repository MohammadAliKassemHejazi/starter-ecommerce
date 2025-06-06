import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="position-relative">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
