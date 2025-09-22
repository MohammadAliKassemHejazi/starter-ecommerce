import { useEffect } from "react";
import { useRouter } from "next/router";

const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /home
    router.replace("/home");
  }, [router]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Redirecting to home...</p>
      </div>
    </div>
  );
};

export default Home;
