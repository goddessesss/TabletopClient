import React, { useEffect, useState } from "react";
import { useAuth } from "../components/Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getFavoriteBoardGames } from "../api/boardgameApi.js";
import {
  getUserProfile,
  updateUserProfile,
  sendEmailConfirmation,
  sendPasswordResetEmail,  // добавляем импорт
} from "../api/profileApi.js";
import { getCreatedEvents } from "../api/eventsApi.js";
import { getSettings } from "../api/profileApi.js";
import { linkGoogleAccount } from "../api/authApi.js";

import AvatarUpload from "../components/AvatarUpload.jsx";
import AlertMessage from "../components/AlertMessages.jsx";
import ProfileDetails from "../components/ProfileTabs/ProfileDetails.jsx";
import CreatedEvents from "../components/ProfileTabs/CreatedEventsTab.jsx";
import { BreadCrumbs } from "../components/BreadCrumbs/BreadCrumbs.jsx";

import { Tab, Nav, Button } from "react-bootstrap";
import {
  FaRegCalendarCheck,
  FaRegClipboard,
  FaGoogle,
  FaCheckCircle,
} from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";

function Profile() {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  const [settings, setSettings] = useState(null);
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
  const [totalEventsSuccessfullyHosted, setTotalEventsSuccessfullyHosted] =
    useState(0);

  const [createdEvents, setCreatedEvents] = useState([]);
  const [loadingCreatedEvents, setLoadingCreatedEvents] = useState(true);

  const [emailConfirming, setEmailConfirming] = useState(false);
  const [passwordResetting, setPasswordResetting] = useState(false); // новый стейт для кнопки сброса пароля

  useEffect(() => {
    const fetchSettings = async () => {
      const result = await getSettings();
      if (result.success) {
        setSettings(result.data);
      } else {
        console.error("Error fetching settings:", result.message);
      }
    };
    fetchSettings();
  }, []);

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
      } else {
        setError(result.message);
      }
      setLoadingProfile(false);
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

  useEffect(() => {
    const fetchCreatedEvents = async () => {
      try {
        const result = await getCreatedEvents();
        if (result.success) {
          setCreatedEvents(result.data || []);
        } else {
          setError(result.message);
        }
      } catch (error) {
        setError("Помилка при завантаженні подій");
      }
      setLoadingCreatedEvents(false);
    };
    fetchCreatedEvents();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await updateUserProfile({ ...formData });
      if (result.success) {
        setSuccessMessage("Профіль оновлено успішно");
        setUserProfile((prev) => ({ ...prev, ...formData }));
      } else {
        setError("Помилка оновлення: " + result.message);
      }
    } catch (error) {
      setError("Помилка при оновленні профілю: " + (error.message || "Невідома помилка"));
    }
  };

  const handleSendEmailConfirmation = async () => {
    setEmailConfirming(true);
    setSuccessMessage("");
    setError(null);
    try {
      const result = await sendEmailConfirmation();
      if (result.success) {
        setSuccessMessage("Лист для підтвердження email надіслано.");
      } else {
        setError("Помилка: " + result.message);
      }
    } catch (error) {
      setError("Не вдалося надіслати лист для підтвердження email.");
    }
    setEmailConfirming(false);
  };

  // Новая функция для отправки письма сброса пароля
  const handleSendPasswordReset = async () => {
    setPasswordResetting(true);
    setSuccessMessage("");
    setError(null);
    try {
      const result = await sendPasswordResetEmail(formData.email);
      if (result.success) {
        setSuccessMessage("Лист для скидання пароля надіслано.");
      } else {
        setError("Помилка: " + result.message);
      }
    } catch (error) {
      setError("Не вдалося надіслати лист для скидання пароля.");
    }
    setPasswordResetting(false);
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    const result = await linkGoogleAccount(token);
    if (result.success) {
      setSuccessMessage("Google акаунт прив'язано успішно!");
    } else {
      setError("Не вдалося прив'язати акаунт: " + result.message);
    }
  };

  const handleGoogleLoginError = () => {
    setError("Помилка при авторизації через Google");
  };

  const handleLogoutClick = () => {
    handleLogout();
    localStorage.clear();
    navigate("/");
  };

  if (loadingProfile) return <div>Завантаження профілю...</div>;

  return (
    <div className="profile-wrapper">
      <div className="container my-2">
        <div className="pt-4">
            <BreadCrumbs
              items={[
                { label: 'Home', path: '/' },
                { label: 'Profile' },
              ]}
            />
        </div>
        <h1 className="fw-bold mb-0">Profile</h1>
      </div>

      {successMessage && (
        <AlertMessage
          variant="success"
          message={successMessage}
          onClose={() => setSuccessMessage("")}
        />
      )}
      {error && <AlertMessage variant="danger" message={error} onClose={() => setError("")} />}

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
                <span>{userProfile.nickname?.trim() ? userProfile.nickname : "User"}</span>
              </h3>
              {userProfile.email && (
                <p className="profile-email">
                  Email: {userProfile.email}
                  {settings?.isEmailConfirmed === false && (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleSendEmailConfirmation}
                      disabled={emailConfirming}
                    >
                      {emailConfirming ? "Sending..." : "Confirm"}
                    </Button>
                  )}
                  {settings?.isEmailConfirmed && (
                    <FaCheckCircle
                      style={{ color: "green", marginLeft: "10px" }}
                      title="Email successfully confirmed"
                    />
                  )}
                </p>
              )}
              <p className="profile-firstName">First name: {userProfile.firstName || "—"}</p>
              <p className="profile-lastName">Last name: {userProfile.lastName || "—"}</p>
              <p className="profile-biography">Bio: {userProfile.bio || "—"}</p>
            </div>
          </div>

          <div className="profile-statistics" style={{ display: "flex", gap: "10px" }}>
            <div className="stat-card">
              <FaRegCalendarCheck className="stat-icon" />
              <p>Total event participations</p>
              <p className="stat-value">{totalEventsParticipated}</p>
            </div>
            <div className="stat-card">
              <FaRegClipboard className="stat-icon" />
              <p>Successfully hosted events</p>
              <p className="stat-value">{totalEventsSuccessfullyHosted}</p>
            </div>
          </div>
        </div>

        <div className="profile-tabs-container">
          <Tab.Container id="profile-tabs" defaultActiveKey="details">
            <Nav variant="tabs" className="profile-tabs-nav">
              <Nav.Item><Nav.Link eventKey="details">Profile</Nav.Link></Nav.Item>
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

              <Tab.Pane eventKey="settings">
                <div style={{ padding: "20px" }}>
                  <h5>Account Settings</h5>

                  <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginError}
                  />

                  <Button
                    variant="outline-secondary"
                    style={{ marginTop: "10px" }}
                    onClick={handleSendPasswordReset}
                    disabled={passwordResetting}
                  >
                    {passwordResetting ? "Sending..." : "Reset Password"}
                  </Button>

                  <Button
                    variant="danger"
                    onClick={handleLogoutClick}
                    style={{ marginTop: "10px" }}
                  >
                    Logout
                  </Button>
                </div>
              </Tab.Pane>

              <Tab.Pane eventKey="myevents">
                <CreatedEvents loading={loadingCreatedEvents} events={createdEvents} />
              </Tab.Pane>

              <Tab.Pane eventKey="recommendations">
                <div>Recommendations...</div>
              </Tab.Pane>

              <Tab.Pane eventKey="favouritegames">
                <div>
                  {loadingFavorites ? (
                    <p>Loading...</p>
                  ) : favoriteGames.length > 0 ? (
                    <ul>
                      {favoriteGames.map((game) => (
                        <li key={game.id}>{game.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No favorite games found.</p>
                  )}
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </div>
  );
}

export default Profile;
