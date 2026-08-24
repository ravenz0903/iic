import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// Use environment variable, fallback to empty string to avoid crashes, but warn the user.
const GOOGLE_CLIENT_ID = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || "";

export const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 text-center space-y-6">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-green-800 text-white rounded-full flex items-center justify-center font-bold text-3xl shadow-sm">
            श्री
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-4 tracking-tight">SRI ANN</h1>
          <p className="text-sm text-gray-500 font-medium tracking-wide uppercase mt-1">
            Government of India
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Sign in to your Farm Account</h2>
          <p className="text-sm text-gray-600 mb-6">
            Please verify your identity using your Google account to access your crop intelligence dashboard.
          </p>
          
          <div className="flex justify-center mt-6">
            {GOOGLE_CLIENT_ID ? (
              <div className="flex flex-col items-center">
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      console.log('Login Success:', credentialResponse);
                      onLogin();
                    }}
                    onError={() => {
                      console.error('Login Failed');
                    }}
                    useOneTap
                  />
                </GoogleOAuthProvider>
                {GOOGLE_CLIENT_ID.includes("dummy") && (
                  <p className="text-[10px] text-red-500 mt-2 max-w-[250px]">
                    * Currently using dummy Client ID. Button will render but login will fail until updated in <code>.env</code>
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded text-left w-full">
                <strong>Google Auth Disabled:</strong> Missing Client ID.
              </div>
            )}
          </div>
          
          <button 
            onClick={onLogin}
            className="mt-6 text-xs font-bold text-gray-500 hover:text-green-800 underline transition"
          >
            Bypass Login (Prototype Mode)
          </button>
        </div>
      </div>
    </div>
  );
};
