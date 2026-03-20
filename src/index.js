import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider, defaultSystem, Spinner } from "@chakra-ui/react";
import Routers from "./Routers";
import "./assets/scss/styles.scss";

// const SignIn = lazy(() => import("./pages/SignIn"));

const root = ReactDOM.createRoot(document.getElementById("root"));

const App = () => {
    return (
        <>
            <Routers />
        </>
    );
};

root.render(
    <React.StrictMode>
        <Suspense fallback={<Spinner />}>
            <ChakraProvider value={defaultSystem}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ChakraProvider>
        </Suspense>
    </React.StrictMode>
);

reportWebVitals(console.log);