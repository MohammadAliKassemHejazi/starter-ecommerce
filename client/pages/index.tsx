import { useEffect } from "react";
import { useRouter } from "next/router";
import { PageLayout } from "@/components/UI/PageComponents";

const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /home (now public)
    router.replace("/home");
  }, [router]);

  return (
    <PageLayout title="Loading..." protected={false}>
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Redirecting to home...</p>
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;