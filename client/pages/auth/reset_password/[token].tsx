import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { PageLayout } from "@/components/UI/PageComponents";
import { showToast } from "@/components/UI/PageComponents/ToastConfig";

type Props = {};

export default function ResetPassword({}: Props) {
  const router = useRouter();
  const { token } = router.query;

  const [eye, setEye] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageError, setMessageError] = useState("");

  const handleTogglePassword = () => {
    setEye(!eye);
    const passwordElement: any = document.querySelector("#password");
    const passwordConfirmationElement: any = document.querySelector("#passwordConfirmation");
    let type;
    if (passwordElement.getAttribute("type") === "password") {
      type = "text";
      setEye(false);
    } else {
      type = "password";
    }
    passwordElement.setAttribute("type", type);
    passwordConfirmationElement.setAttribute("type", type);
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== passwordConfirmation) {
      setMessageError("Passwords do not match");
      showToast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setMessageError("Password must be at least 8 characters long");
      showToast.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token, 
          password,
          passwordConfirmation 
        }),
      });

      if (response.ok) {
        showToast.success("Password reset successfully");
        router.push("/auth/signin");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      showToast.error(error instanceof Error ? error.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const ResetPasswordForm = () => (
    <div className="col-md-7 pe-0">
      <div className="form-left h-100 py-5 px-5">
        <form onSubmit={handleResetPassword} className="row g-4">
          <div className="col-12">
            <label>
              New Password<span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <div className="input-group-text">
                <i className="fas fa-lock" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
            </div>
          </div>
          <div className="col-12">
            <label>
              New Password confirmation
              <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <div className="input-group-text">
                <i className="fas fa-lock" />
              </div>
              <input
                type="password"
                id="passwordConfirmation"
                name="passwordConfirmation"
                className="form-control"
                placeholder="Confirm Password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                minLength={8}
                required
              />
            </div>
            {messageError && (
              <div className="text-danger small mt-1">{messageError}</div>
            )}
          </div>
          <div className="col-sm-6">
            <div className="form-check">
              <div
                className="btn"
                onClick={handleTogglePassword}
              >
                {eye === true ? (
                  <i className="fas fa-eye" />
                ) : (
                  <i className="fas fa-eye-slash" />
                )}
              </div>
              <label className="form-check-label">
                show password
              </label>
            </div>
          </div>

          <div className="col-12">
            <button
              type="submit"
              className="me-3 btn btn-primary px-4 float-end mt-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Resetting...
                </>
              ) : (
                'Confirm'
              )}
            </button>

            <div className="px-4 float-end mt-4">
              <Link href="/auth/signin">
                <span className="btn text-primary">Cancel</span>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  const ResetPasswordSidebar = () => (
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
        <h2 className="mt-3">astra&apos;s example</h2>
      </div>
    </div>
  );

  return (
    <PageLayout title="Reset Password" subtitle="Enter your new password" protected={false}>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
      />

      <div className="login-page" style={{ background: 'var(--bs-body-bg)', color: 'var(--bs-body-color)' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              <h3 className="mb-3">Reset Password</h3>
              <div className="shadow rounded" style={{ background: 'var(--bs-component-bg)', border: '1px solid var(--bs-border-color)' }}>
                <div className="row">
                  <ResetPasswordForm />
                  <ResetPasswordSidebar />
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