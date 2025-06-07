import React from "react";
import { Button } from "react-bootstrap";
import { GoogleLogin } from "@react-oauth/google";

function SettingsTab({
  emailConfirming,
  passwordResetting,
  isEmailConfirmed,
  onSendEmailConfirmation,
  onSendPasswordReset,
  onLogout,
  onGoogleLoginSuccess,
  onGoogleLoginError,
}) {
  return (
    <>
       <div className="mb-4">
        <h2 className="fw-bold text-dark">Account Settings</h2>
        <hr className="mb-4" />
      </div>

      <div className="d-flex mb-3" style={{ gap: "12px" }}>
        <GoogleLogin
          onSuccess={onGoogleLoginSuccess}
          onError={onGoogleLoginError}
          useOneTap
        />
        <span>Login with Google to link your account</span>
      </div>

      <div className="d-grid gap-3 mb-3">
        <Button
          variant="primary"
          size="lg"
          onClick={onSendPasswordReset}
          disabled={passwordResetting}
          className="fw-semibold"
        >
          {passwordResetting ? "Sending..." : "Send Password Reset Email"}
        </Button>

        {!isEmailConfirmed && (
          <Button
            variant="outline-primary"
            size="lg"
            onClick={onSendEmailConfirmation}
            disabled={emailConfirming}
            className="fw-semibold"
          >
            {emailConfirming ? "Sending confirmation..." : "Send Email Confirmation"}
          </Button>
        )}
      </div>

      <Button
        variant="danger"
        size="lg"
        className="w-100 fw-semibold"
        onClick={onLogout}
      >
        Logout
      </Button>
    </>
  );
}

export default SettingsTab;
