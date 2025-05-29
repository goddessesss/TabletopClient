import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPasswordConfirm } from "../api/profileApi.js";
import { FaLock } from "react-icons/fa"; // Іконка замка

function ResetPasswordConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const userId = searchParams.get("userId");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!token || !userId) {
    return <p className="message-error">Invalid or missing parameters for password reset.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await resetPasswordConfirm({
        userId: Number(userId),
        token,
        newPassword: password,
      });

      if (result.success) {
        setSuccessMessage("✅ Password successfully changed. Redirecting...");
        setTimeout(() => navigate("/profile"), 3000);
      } else {
        setError(result.message || "❌ An error occurred while changing the password.");
      }
    } catch (e) {
      setError("❌ Failed to change password.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <div className="icon-wrapper">
          <FaLock size={48} color="#ff7f50" />
        </div>
        <h2>Reset Password</h2>

        {error && <div className="reset-error">{error}</div>}
        {successMessage && <div className="reset-success">{successMessage}</div>}

        {!successMessage && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? " Saving..." : " Save"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordConfirm;
