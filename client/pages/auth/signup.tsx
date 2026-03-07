import { PageLayout } from "@/components/UI/PageComponents";
import { signUp } from "@/store/slices/userSlice";
import { useAppDispatch } from "@/store/store";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { showToast } from "@/components/UI/PageComponents/ToastConfig";

type Props = {};

export default function SignUp({}: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [eye, setEye] = useState(true);
  const [passwordError, setPasswordError] = useState("");

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

  const validatePasswords = (password: string, passwordConfirmation: string) => {
    if (password && passwordConfirmation && password !== passwordConfirmation) {
      setPasswordError("Passwords do not match");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const passwordConfirmation = formData.get("passwordConfirmation") as string;
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    
    // Check if passwords match before submitting
    if (!validatePasswords(password, passwordConfirmation)) {
      showToast.error("Passwords do not match!");
      return;
    }
    
    const response = await dispatch(signUp({ email, password, name, address, phone }));

    if (response.meta.requestStatus === "fulfilled") {
      showToast.success("Signup successful!");
      router.push("/auth/signin");
    } else {
      showToast.error("Signup failed, please try again!");
    }
  };

  const SignupForm = () => (
    <div className="col-md-7 pe-0">
      <div className="form-left py-5 px-5">
        <form onSubmit={handleRegister} className="row g-4">
          <div className="col-12">
            <label>
              Email<span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <div className="input-group-text">
                <i className="fas fa-envelope" />
              </div>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter email"
                required
              />
            </div>
          </div>
          <div className="col-12">
            <label>Name <span className="text-danger">*</span></label>
            <div className="input-group">
              <div className="input-group-text">
                <i className="fas fa-user" />
              </div>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter Name"
                required
              />
            </div>
          </div>

          <div className="col-12">
            <label>Address <span className="text-danger">*</span></label>
            <div className="input-group">
              <div className="input-group-text">
                <i className="fas fa-map-marker-alt" />
              </div>
              <input
                type="text"
                name="address"
                className="form-control"
                placeholder="Enter Address"
                required
              />
            </div>
          </div>

          <div className="col-12">
            <label>Phone <span className="text-danger">*</span></label>
            <div className="input-group">
              <div className="input-group-text">
                <i className="fas fa-phone" />
              </div>
              <input
                type="text"
                name="phone"
                className="form-control"
                placeholder="Enter Phone"
                required
              />
            </div>
          </div>

          <div className="col-12">
            <label>
              Password <span className="text-danger">*</span>
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
                minLength={8}
                maxLength={150}
                required
              />
            </div>
          </div>
          <div className="col-12">
            <label>
              Password confirmation <span className="text-danger">*</span>
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
                minLength={8}
                maxLength={150}
                placeholder="Confirm Password"
                required
              />
            </div>
            {passwordError && (
              <div className="text-danger mt-1">
                {passwordError}
              </div>
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
            >
              Sign Up
            </button>

            <div className="px-4 float-end mt-4">
              <span>Already have an account ?</span>
              <Link href="/auth/signin">
                <span className="btn text-primary">Sign In</span>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  const SignupSidebar = () => (
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
    <PageLayout title="Sign Up" subtitle="Create your account" protected={false}>
      <div className="login-page" style={{ background: 'var(--bs-body-bg)', color: 'var(--bs-body-color)' }}>
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-12">
              <h3 className="mb-3">Sign Up</h3>
              <div className="shadow rounded" style={{ background: 'var(--bs-component-bg)', border: '1px solid var(--bs-border-color)' }}>
                <div className="row">
                  <SignupForm />
                  <SignupSidebar />
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
            display: inline-block;
            display: flex;
            align-items: center;
          }
          .form-right i {
            font-size: 100px;
          }

          .bg-login { background: var(--sidebar-bg, var(--bs-primary)); }

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