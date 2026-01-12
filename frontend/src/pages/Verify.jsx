import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh" // full screen center
};

const buttonStyle = {
  width: "60%",            // 👈 wider button
  maxWidth: "28rem",       // prevents too wide on large screens
  padding: "1rem 0",
  fontSize: "1.1rem",
  fontWeight: "600",
  background: "linear-gradient(135deg, #6366f1, #4f46e5)",
  color: "#ffffff",
  border: "none",
  borderRadius: "0.75rem",
  cursor: "pointer",
  boxShadow: "0 0.75rem 1.75rem rgba(79, 70, 229, 0.4)",
  transition: "transform 0.25s ease, box-shadow 0.25s ease"
};

const Verify = () => {
    const {token} = useParams();
    const [status, setStatus] = useState("verifying...");
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async() => {
            try {
                const res = await axios.post("http://localhost:8000/api/verify", {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                if(res.data.success){
                    setStatus("✅ Email verified successfully");
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000)
                } else{
                    setStatus("❌ Invalid or expired token")
                }
            } catch (error) {
                console.log(error);
                setStatus("❌ Verification failed, please try again");
            }
        }

        verifyEmail();
    }, [token, navigate])



  return (
    <div style={containerStyle}>
      <button
        style={buttonStyle}
        onMouseOver={(e) => {
          e.target.style.transform = "scale(1.03)";
          e.target.style.boxShadow =
            "0 1rem 2.2rem rgba(79, 70, 229, 0.55)";
        }}
        onMouseOut={(e) => {
          e.target.style.transform = "scale(1)";
          e.target.style.boxShadow =
            "0 0.75rem 1.75rem rgba(79, 70, 229, 0.4)";
        }}
      >
        {status}
      </button>
    </div>
  );
};

export default Verify;