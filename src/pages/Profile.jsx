import React, { useEffect, useState } from "react";
import { useAuth } from "../components/Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getFavoriteBoardGames } from "../api/boardgameApi.js";
import { getUserProfile, updateUserProfile } from "../api/profileApi.js";
import AvatarUpload from "../components/AvatarUpload.jsx";
import AlertMessage from "../components/AlertMessages.jsx";
import ProfileDetails from "../components/ProfileDetails.jsx";
import { Tab, Nav, Button } from "react-bootstrap";
import { FaRegCalendarCheck, FaRegClipboard } from 'react-icons/fa';

function Profile() {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    bio: "",
    email: "",
  });

  const [favoriteGames, setFavoriteGames] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [error, setError] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const [totalEventsParticipated, setTotalEventsParticipated] = useState(0);
  const [totalEventsSuccessfullyHosted, setTotalEventsSuccessfullyHosted] = useState(0);

  const handleLogoutClick = () => {
    handleLogout();
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const result = await getUserProfile();
      if (result.success) {
        const data = result.data;
        setUserProfile(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          nickname: data.nickname || "",
          bio: data.bio || "",
          email: data.email || "",
        });
        setTotalEventsParticipated(data.totalEventsParticipated || 0);
        setTotalEventsSuccessfullyHosted(data.totalEventsSuccessfullyHosted || 0);
        setLoadingProfile(false);
      } else {
        setError(result.message);
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchFavoriteGames = async () => {
      const result = await getFavoriteBoardGames();
      if (result.success) {
        setFavoriteGames(result.favorites);
      } else {
        setError(result.message);
      }
      setLoadingFavorites(false);
    };
    fetchFavoriteGames();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };

    try {
      const result = await updateUserProfile(payload);
      if (result.success) {
        setSuccessMessage("Profile updated successfully");
        setUserProfile((prev) => ({ ...prev, ...payload }));
      } else {
        setError("Update error: " + result.message);
      }
    } catch {
      setError("Error while updating profile");
    }
  };

  if (loadingProfile) return <div>Loading...</div>;

  return (
    <div className="profile-wrapper">
      {successMessage && (
        <AlertMessage
          variant="success"
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}
      {error && (
        <AlertMessage
          variant="danger"
          message={error}
          onClose={() => setError("")}
        />
      )}

      <div className="profile-container">
        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-info-left">
              <AvatarUpload
                avatarPath={userProfile.avatarPath}
                setAvatarPath={(path) => {
                  setUserProfile((prev) => ({ ...prev, avatarPath: path }));
                  setSuccessMessage("Avatar updated successfully");
                }}
                setError={setError}
              />
            </div>
            <div className="profile-info-right">
              <h3 className="profile-nickName" style={{ marginBottom: "20px" }}>
                <span>{userProfile.nickname || "Unknown User"}</span>
              </h3>
              <p className="profile-email">Email: {userProfile.email}</p>
              <p className="profile-firstName">First Name: {userProfile.firstName || "No firstname"}</p>
              <p className="profile-lastName">Last Name: {userProfile.lastName || "No lastname"}</p>
              <p className="profile-biography">Biography: {userProfile.bio || "No biography provided"}</p>
            </div>
          </div>

          <div className="profile-statistics" style={{ display: "flex", gap: "10px" }}>
            <div className="stat-card">
              <FaRegCalendarCheck className="stat-icon" />
              <p>Total Events Participated</p>
              <p className="stat-value">{totalEventsParticipated}</p>
            </div>
            <div className="stat-card">
              <FaRegClipboard className="stat-icon" />
              <p>Total Events Successfully Hosted</p>
              <p className="stat-value">{totalEventsSuccessfullyHosted}</p>
            </div>
          </div>
        </div>

        <div className="profile-tabs-container">
          <Tab.Container id="profile-tabs" defaultActiveKey="details">
            <Nav variant="tabs" className="profile-tabs-nav">
              <Nav.Item><Nav.Link eventKey="details">Details</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="settings">Settings</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="myevents">My Events</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="recommendations">Recommendations</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="favouritegames">Favorite Games</Nav.Link></Nav.Item>
            </Nav>
            <Tab.Content className="profile-tabs-content">
              <Tab.Pane eventKey="details">
                <ProfileDetails
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>

      <Button
        variant="danger"
        style={{ width: "100%", marginTop: "20px" }}
        onClick={handleLogoutClick}
      >
        Logout
      </Button>
    </div>
  );
}

export default Profile;
