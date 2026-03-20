import { Form, FormLayout, TextField, Button } from "@shopify/polaris";
import React, { useState } from "react";
import logo from "../../assets/images/logo-trust.svg";
import Http from "../../layouts/Http";
import { API_URL } from "../../api/Config";
import { Loading, Frame } from "@shopify/polaris";

const SignIn = () => {
    const [storeName, setStoreName] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    function handleInstall(shop = null) {
        Http.post(API_URL + "/shopify/generate-url", {
            shop: shop ?? storeName,
        })
            .then((res) => {
                setIsLoading(false);
                const { errors, status, data } = res.data;
                if (!status) {
                    alert(errors[0]);
                } else {
                    window.location.href = data;
                }
            })
            .catch((error) => {
                alert(error);
            });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const hmac = urlParams.get("hmac");
    let host = urlParams.get("host");
    let shop = urlParams.get("shop");

    if (hmac && shop && host) {
        handleInstall(shop);
        return (
            <Frame>
                <Loading />
            </Frame>
        );
    } else {
        const handleSubmitLogin = () => {
            if (!storeName.trim()) {
                setError("Please enter your Store Name");
                return;
            }
            setIsLoading(true);
            handleInstall();
        };

        const handleKeyPress = (event) => {
            if (event.key === "Enter") {
                handleSubmitLogin();
            }
        };

        return (
            <div className="page-login">
                <div className="gradient-background"></div>
                <div className="page-main">
                    <div className="page-content with-shadow">
                        <div className="login-card ">
                            <div className="login-card__header">
                                <h1 className="login-card__logo">
                                    <a title="TrustShop" href="#1">
                                        <img src={logo} alt="TrustShop" height="80px" />
                                    </a>
                                </h1>
                            </div>
                            <div className="login-card__content">
                                <div className="main-card-section">
                                    <h1 className="ui-heading">
                                        Sign in to Shop
                                    </h1>
                                    <h3 className="ui-subheading ui-subheading--subdued">
                                        Please enter your Shopify URL
                                    </h3>
                                    <Form onSubmit={handleSubmitLogin}>
                                        <FormLayout>
                                            <TextField
                                                value={storeName}
                                                onKeyDown={handleKeyPress}
                                                onChange={(e) =>
                                                    setStoreName(e)
                                                }
                                                type="text"
                                                autoComplete="store"
                                                placeholder="Store Name"
                                                error={error}
                                                helpText={
                                                    <span>.myshopify.com</span>
                                                }
                                                label={""}
                                            />
                                            <Button
                                                submit
                                                size="large"
                                                tone="success"
                                                variant="primary"
                                                {...(isLoading && {
                                                    disabled: true,
                                                    loading:true
                                                })}
                                            >
                                                Submit
                                            </Button>
                                        </FormLayout>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
export default SignIn;
