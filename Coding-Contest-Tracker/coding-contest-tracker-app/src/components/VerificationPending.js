import React, { useState, useEffect } from 'react';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import { useParams, useNavigate } from 'react-router-dom';

const VerificationPending = () => {
    const { email } = useParams(); // Access email parameter from the URL
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user && !user.emailVerified) {
            // If user is not email verified, send verification email
            sendEmailVerification(user)
                .then(() => {
                    setIsEmailSent(true);
                })
                .catch((error) => {
                    console.error('Error sending email verification:', error);
                });
        } else if (user && user.emailVerified) {
            // If user is already email verified, set email verification status
            setIsEmailVerified(true);
        }
    }, [refreshKey]);

    const resendVerificationEmail = () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user && !user.emailVerified) {
            // If user is not email verified, resend verification email
            sendEmailVerification(user)
                .then(() => {
                    setIsEmailSent(true);
                })
                .catch((error) => {
                    console.error('Error sending email verification:', error);
                });
        }
    };

    const handleRefresh = () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            // Reload user data to pick up changes
            user.reload()
                .then(() => {
                    setIsEmailVerified(user.emailVerified);
                    setRefreshKey((prevKey) => prevKey + 1);

                    // Check if user has verified email
                    if (user.emailVerified) {
                        navigate('/contests');
                    }
                })
                .catch((error) => {
                    console.error('Error reloading user data:', error);
                });
        }
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-2">
            <h1 className="text-2xl font-bold mb-4">Email Verification Pending</h1>
            {isEmailSent ? (
                <p>
                    Verification email resent to <strong>{email}</strong>. Please check your inbox and verify your email to proceed.
                </p>
            ) : (
                <p>
                    Please verify your email. If you haven't received the verification email, you can click below to resend it.
                </p>
            )}
            {!isEmailVerified && (
                <button onClick={resendVerificationEmail} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                    Resend Verification Email
                </button>
            )}
            <button onClick={handleRefresh} className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
                Refresh Email Verification Status
            </button>
        </div>
    );
};

export default VerificationPending;
