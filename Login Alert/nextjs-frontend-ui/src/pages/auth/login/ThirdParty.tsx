// SocialLogin.tsx
import React from "react";
import firebase from "firebase/app";
import "firebase/auth";

const SocialLogin: React.FC = () => {
    const handleGoogleLogin = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            await firebase.auth().signInWithPopup(provider);
        } catch (error) {
            console.error("Google login error", error);
        }
    };

    const handleFacebookLogin = async () => {
        // Replace with Facebook login logic if using Facebook as an authentication provider.
    };

    return (
        <div>
            <button onClick={handleGoogleLogin}>Login with Google</button>
            <button onClick={handleFacebookLogin}>Login with Facebook</button>
        </div>
    );
};

export default SocialLogin;