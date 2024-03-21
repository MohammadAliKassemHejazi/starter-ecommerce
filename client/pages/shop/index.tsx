import Layout from "@/components/Layouts/Layout";
import protectedRoute from "@/components/protectedRoute";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import styles from './Shop.module.css';

type Props = {};

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

const Shop = ({}: Props) => {
  const router = useRouter();

  return (
    <Layout>
      <div className="container mt-5">
        <section>
          <div className="container my-5">
            <header className="mb-4">
              <h3>New products</h3>
            </header>
            <div className="row">
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="card my-2 shadow-0">
                  <div className="position-relative">
                    <div className={styles.mask}>
                      
                        <h6>
                          <span className="badge bg-danger pt-1 position-absolute top-0 start-0">
                            New
                          </span>
                        </h6>
                    
                    </div>
                    <div className="image-container">
                      <Image
                        src="/fakeimages/shoes.jpg"
                        alt="shoes"
                        layout="responsive"
                        width={400}
                        height={300}
                        className="card-img-top rounded-2"
                      />
                    </div>
                  </div>
                  <div className="card-body p-0 pt-3">
                    <a
                      href="#!"
                      className="btn btn-light border px-2 pt-2 float-end icon-hover"
                    >
                      <i className="fas fa-heart fa-lg px-1 text-secondary"></i>
                    </a>
                    <h5 className="card-title">$29.95</h5>
                    <p className="card-text mb-0">GoPro action camera 4K</p>
                    <p className="text-muted">Model: X-200</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="card my-2 shadow-0">
                  <div className="position-relative">
                    <div className="mask">
                      
                        <h6>
                          <span className="badge bg-selective pt-1 position-absolute top-0 start-0">
                            offer
                          </span>
                        </h6>
                  
                    </div>
                    <div className="image-container">
                      <Image
                        src="/fakeimages/shoes.jpg"
                        alt="shoes"
                        layout="responsive"
                        width={400}
                        height={300}
                        className="card-img-top rounded-2"
                      />
                    </div>
                  </div>
                  <div className="card-body p-0 pt-3">
                    <a
                      href="#!"
                      className="btn btn-light border px-2 pt-2 float-end icon-hover"
                    >
                      <i className="fas fa-heart fa-lg px-1 text-secondary"></i>
                    </a>
                    <h5 className="card-title">$29.95</h5>
                    <p className="card-text mb-0">GoPro action camera 4K</p>
                    <p className="text-muted">Model: X-200</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="card my-2 shadow-0">
                  <div className="image-container">
                    <Image
                      src="/fakeimages/shoes.jpg"
                      alt="shoes"
                      layout="responsive"
                      width={400}
                      height={300}
                      className="card-img-top rounded-2"
                    />
                  </div>
                  <div className="card-body p-0 pt-2">
                    <a
                      href="#!"
                      className="btn btn-light border px-2 pt-2 float-end icon-hover"
                    >
                      <i className="fas fa-heart fa-lg px-1 text-secondary"></i>
                    </a>
                    <h5 className="card-title">$29.95</h5>
                    <p className="card-text mb-0">Modern product name here</p>
                    <p className="text-muted">Sizes: S, M, XL</p>
                  </div>
                </div>
              </div>
                  <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="card my-2 shadow-0">
                  <div className="image-container">
                    <Image
                      src="/fakeimages/shoes.jpg"
                      alt="shoes"
                      layout="responsive"
                      width={400}
                      height={300}
                      className="card-img-top rounded-2"
                    />
                  </div>
                  <div className="card-body p-0 pt-2">
                    <a
                      href="#!"
                      className="btn btn-light border px-2 pt-2 float-end icon-hover"
                    >
                      <i className="fas fa-heart fa-lg px-1 text-secondary"></i>
                    </a>
                    <h5 className="card-title">$29.95</h5>
                    <p className="card-text mb-0">Modern product name here</p>
                    <p className="text-muted">Sizes: S, M, XL</p>
                  </div>
                </div>
              </div>
                  <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="card my-2 shadow-0">
                  <div className="image-container">
                    <Image
                      src="/fakeimages/shoes.jpg"
                      alt="shoes"
                      layout="responsive"
                      width={400}
                      height={300}
                      className="card-img-top rounded-2"
                    />
                  </div>
                  <div className="card-body p-0 pt-2">
                    <a
                      href="#!"
                      className="btn btn-light border px-2 pt-2 float-end icon-hover"
                    >
                      <i className="fas fa-heart fa-lg px-1 text-secondary"></i>
                    </a>
                    <h5 className="card-title">$29.95</h5>
                    <p className="card-text mb-0">Modern product name here</p>
                    <p className="text-muted">Sizes: S, M, XL</p>
                  </div>
                </div>
              </div>
                  <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="card my-2 shadow-0">
                  <div className="image-container">
                    <Image
                      src="/fakeimages/shoes.jpg"
                      alt="shoes"
                      layout="responsive"
                      width={400}
                      height={300}
                      className="card-img-top rounded-2"
                    />
                  </div>
                  <div className="card-body p-0 pt-2">
                    <a
                      href="#!"
                      className="btn btn-light border px-2 pt-2 float-end icon-hover"
                    >
                      <i className="fas fa-heart fa-lg px-1 text-secondary"></i>
                    </a>
                    <h5 className="card-title">$29.95</h5>
                    <p className="card-text mb-0">Modern product name here</p>
                    <p className="text-muted">Sizes: S, M, XL</p>
                  </div>
                </div>
              </div>
                  <div className="col-lg-3 col-md-6 col-sm-6">
                <div className="card my-2 shadow-0">
                  <div className="image-container">
                    <Image
                      src="/fakeimages/iphone.jpg"
                      alt="shoes"
                      layout="responsive"
                      width={400}
                      height={300}
                      className="card-img-top rounded-2"
                    />
                  </div>
                  <div className="card-body p-0 pt-2">
                    <a
                      href="#!"
                      className="btn btn-light border px-2 pt-2 float-end icon-hover"
                    >
                      <i className="fas fa-heart fa-lg px-1 text-secondary"></i>
                    </a>
                    <h5 className="card-title">$29.95</h5>
                    <p className="card-text mb-0">Modern product name here</p>
                    <p className="text-muted">Sizes: S, M, XL</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <style jsx>
  {`
    /* Styles for the mask */
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      height: 50px; /* Height for the badges */
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      padding: 0.5rem;
      box-sizing: border-box;
      z-index: 1; /* Ensure badges appear above the image */
    }

    /* Styles for the badge */
    .badge {
      background-color: #f00; /* Adjust as needed */
      color: #fff;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
    }

    /* Styles for the image container */
    .image-container {
      width: 100%;
    
      position: relative;
      z-index: 0; /* Ensure image is below the badges */
    }

    /* Styles for the card */
    .card {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%; /* Ensure cards take the full height */
    }

    /* Styles for the card body */
    .card-body {
      flex-grow: 1; /* Allow card body to expand */
    }
  `}
</style>

    </Layout>
  );
};

export default protectedRoute(Shop);
