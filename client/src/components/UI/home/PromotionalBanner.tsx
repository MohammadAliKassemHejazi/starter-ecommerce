import React from "react";
import Link from "next/link";

const PromotionalBanner: React.FC = () => {
  return (
    <section className="py-5 bg-light my-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-8 mx-auto text-center">
            <div className="p-5 bg-white shadow rounded-3 position-relative overflow-hidden">
              <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10"
                style={{
                  background: 'linear-gradient(45deg, var(--bs-primary) 0%, var(--bs-info) 100%)',
                  zIndex: 0
                }}>
              </div>
              <div className="position-relative" style={{ zIndex: 1 }}>
                <span className="badge bg-danger mb-3 px-3 py-2 rounded-pill">Limited Time Offer</span>
                <h2 className="display-5 fw-bold mb-3">Summer Sale is Live!</h2>
                <p className="lead mb-4 text-muted">
                  Get up to <span className="fw-bold text-primary">50% OFF</span> on selected items from our top stores.
                  Don&apos;t miss out on the best deals of the season.
                </p>
                <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                  <Link href="/shop" className="btn btn-primary btn-lg px-4 gap-3">
                    Shop Now
                  </Link>
                  <Link href="/shop" className="btn btn-outline-secondary btn-lg px-4">
                    View Deals
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanner;
