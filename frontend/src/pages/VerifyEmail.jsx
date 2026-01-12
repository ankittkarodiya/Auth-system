import React from "react";

const VerifyEmail = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
        
        <div className="text-4xl mb-4">✅</div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Check Your Email
        </h2>

        <p className="text-gray-600 text-sm leading-relaxed">
          We've sent you an email to verify your account.  
          Please check your inbox and click the verification link to continue.
        </p>

        <p className="mt-4 text-xs text-gray-400">
          Didn't receive the email? Check your spam folder.
        </p>

      </div>
    </div>
  );
};

export default VerifyEmail;

