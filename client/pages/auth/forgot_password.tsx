import { PageLayout } from "@/components/UI/PageComponents";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { showToast } from "@/components/UI/PageComponents/ToastConfig";

type Props = {};

export default function ForgotPassword({}: Props) {
  const [responseText, setResponseText] = useState("");
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMail = async () => {
    if (email === "") {
      setError(true);
      setResponseText("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setError(false);
        setResponseText("Password reset email sent successfully");
        showToast.success("Password reset email sent successfully");
      } else {
        setError(true);
        setResponseText("Email not found");
        showToast.error("Email not found");
      }
    } catch (error) {
      setError(true);
      setResponseText("Failed to send reset email");
      showToast.error("Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  const ForgotPasswordForm = () => (
    <div className="col-md-7 pe-0 mb-5">
      <div className="form-left h-100 py-5 px-5">
        <div className="row g-4">
          <div className="col-12">
            <label className="mt-4 mb-3">
              Please enter your email to reset your password
              <span className="text-danger">*</span>
            </label>
            <label className="mb-3">
              <span className="text-danger">
                {error && <>&nbsp;{responseText} !</>}
              </span>
              <span className="text-success">
                {!error && <>&nbsp;{responseText} !</>}
              </span>
            </label>
            <div className="input-group">
              <div className="input-group-text">
                <i className="fas fa-envelope" />
              </div>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="col-12">
            <button
              onClick={handleSendMail}
              className="me-3 btn btn-primary px-4 float-end mt-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Sending...
                </>
              ) : (
                'Send Email'
              )}
            </button>
            <div className="d-flex gap-2 float-start mt-4">
              <Link href="/auth/signup">
                <span className="btn text-primary">Sign Up</span>
              </Link>
              <Link href="/auth/signin">
                <span className="btn text-primary">Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ForgotPasswordSidebar = () => (
    <div className="col-md-5 ps-0 d-none d-md-block">
      <div className="form-right h-100 bg-login text-white text-center pt-5">
        <Image
          alt="logo"
          className="logo"
          src="/resources/static/img/logo.png"
          height={150}
          width={150}
          priority
        />
        <h2 className="mt-3">Astra&apos;s example</h2>
      </div>
    </div>
  );

  return (
    <PageLayout title="Forgot Password?" subtitle="Reset your password" protected={false}>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
      />

      <div className="login-page" style={{ background: 'var(--bs-body-bg)', color: 'var(--bs-body-color)' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              <h3 className="mb-3">Forgot Password?</h3>
              <div className="shadow rounded" style={{ background: 'var(--bs-component-bg)', border: '1px solid var(--bs-border-color)' }}>
                <div className="row">
                  <ForgotPasswordForm />
                  <ForgotPasswordSidebar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>
        {`
          a {
            text-decoration: none;
          }
          .login-page {
            width: 100%;
            height: 100vh;
            display: inline-block;
            display: flex;
            align-items: center;
          }
          .form-right i {
            font-size: 100px;
          }

          .bg-login {
            background-color: #3b90ff;
          }

          .logo {
            border-radius: 50%;
          }

          .text__status {
            font-size: 1.5rem;
          }

          .status-page {
            width: 100%;
            height: 100vh;
            align-items: center;
            text-align: center;
            display: inline-block;
            display: flex;
          }
        `}
      </style>
    </PageLayout>
  );
}