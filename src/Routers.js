import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Spinner } from "@chakra-ui/react";
import MainLayout from "./layouts/MainLayout";

const Home = lazy(() => import("./pages/Home"));

function Routers() {
    return (
        <Suspense fallback={<Spinner/>}>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/*" element={<Home />} />
                </Routes>
            </MainLayout>
        </Suspense>
    );
}

export default Routers;
