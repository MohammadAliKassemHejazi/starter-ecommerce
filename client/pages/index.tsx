import type { NextPage } from "next";
import { useEffect } from "react";
import ProtectedRoute from "@/components/protectedRoute";
import { useAppDispatch } from "@/store/store";


const Home: NextPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    
  }, [dispatch]);
  return (
    <>

    </>
  );
};

export default function ProtectedHome() {
  return (
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  );
}
