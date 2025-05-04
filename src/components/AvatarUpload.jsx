import React, { useEffect, useState } from "react";
import { Button, Spinner, Alert } from "react-bootstrap";
import { uploadProfilePicture } from "../api/profileApi.js";
import avatarDefault from "../assets/avatar.png";

const AvatarUpload = ({ avatarPath, setAvatarPath, setError }) => {
  const [newAvatar, setNewAvatar] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleAvatarClick = () => {
    document.getElementById("avatarInput").click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(file);
      setImageLoading(true);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSubmit = async (e) => {
    e.preventDefault();
    if (!newAvatar) {
      setError("Please select a file to upload");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", newAvatar);

    const result = await uploadProfilePicture(formData);
    setUploading(false);

    if (result.success) {
      setAvatarPath(result.data.avatarPath);
      setNewAvatar(null);
      setPreviewUrl(null);
      setError(null);
      setTimeout(() => setSuccessMessage(null), 3000);

      window.location.reload();
    } else {
      setError(result.message || "Failed to upload avatar");
    }
  };

  useEffect(() => {
    setImageLoading(true);
  }, [avatarPath]);

  const currentImage = previewUrl || avatarPath || avatarDefault;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
      <div style={{ width: "120px", height: "120px", position: "relative" }}>
        {imageLoading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f0f0f0",
              borderRadius: "50%",
              zIndex: 2,
            }}
          >
            <Spinner animation="border" variant="secondary" />
          </div>
        )}
        <img
          src={currentImage}
          alt="Profile"
          onClick={handleAvatarClick}
          onLoad={() => setImageLoading(false)}
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            cursor: "pointer",
            zIndex: 1,
          }}
        />
      </div>

      <input
        id="avatarInput"
        type="file"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div style={{ marginTop: "10px" }}>
        <Button
          onClick={handleAvatarSubmit}
          variant="outline-secondary"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Update Avatar"}
        </Button>
      </div>

      {successMessage && (
        <Alert variant="success" style={{ marginTop: "10px" }}>
          {successMessage}
        </Alert>
      )}
    </div>
  );
};

export default AvatarUpload;
