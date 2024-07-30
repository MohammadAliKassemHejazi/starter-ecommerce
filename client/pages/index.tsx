import type { NextPage } from "next";
import { useEffect } from "react";
import protectedRoute from "@/components/protectedRoute";
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

export default protectedRoute(Home);
