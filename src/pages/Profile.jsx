import React, { useEffect, useState } from "react";
import { useAuth } from "../components/Context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getUserProfile,
  updateUserProfile,
  sendEmailConfirmation,
  sendPasswordResetEmail,
  getSettings,
} from "../api/profileApi.js";
import {
  getCreatedEvents,
  deleteEventById,
  getJoinedEvents,
} from "../api/eventsApi.js"; 
import { GoogleLogin } from "@react-oauth/google";
import AvatarUpload from "../components/AvatarUpload.jsx";
import ProfileDetails from "../components/ProfileTabs/ProfileDetails.jsx";
import CreatedEventsTab from "../components/ProfileTabs/CreatedEventsTab.jsx";
import RecommendationsTab from "../components/ProfileTabs/RecommendationsTab.jsx";
import FavoriteGames from "../components/ProfileTabs/FavoriteGamesTab.jsx";
import { BreadCrumbs } from "../components/BreadCrumbs/BreadCrumbs.jsx";
import { useNotifications } from "../components/NotificationsHandling/NotificationContext.jsx";
import { Tab, Nav, Button } from "react-bootstrap";
import {
  FaRegCalendarCheck,
  FaCheckCircle,
  FaUsers,
  FaCog,
  FaHeart,
  FaUserCircle,
  FaStar,
} from "react-icons/fa";
import JoinedEventsTab from "../components/ProfileTabs/JoinedEventsTab.jsx";
import ProfileStatistics from "../components/ProfileTabs/ProfileStatistics.jsx";

function Profile() {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [settings, setSettings] = useState(null);
  const [userProfile, setUserProfile] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    bio: "",
    email: "",
  });

  const [totalEventsParticipated, setTotalEventsParticipated] = useState(0);
  const [totalEventsSuccessfullyHosted, setTotalEventsSuccessfullyHosted] = useState(0);

  const [createdEvents, setCreatedEvents] = useState([]);
  const [loadingCreatedEvents, setLoadingCreatedEvents] = useState(true);

  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loadingJoinedEvents, setLoadingJoinedEvents] = useState(true);

  const [emailConfirming, setEmailConfirming] = useState(false);
  const [passwordResetting, setPasswordResetting] = useState(false);

  useEffect(() => {
    (async () => {
      const result = await getSettings();
      if (result.success) setSettings(result.data);
      else console.error("Error fetching settings:", result.message);
    })();
  }, []);

  useEffect(() => {
    (async () => {
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
      }
      setLoadingProfile(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const result = await getCreatedEvents();
        if (result.success) setCreatedEvents(result.data || []);
      } catch {
        addNotification({
          message: "Error while retrieving events",
          variant: "danger",
        });
      }
      setLoadingCreatedEvents(false);
    })();
  }, []);
 const handleGoogleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    const result = await linkGoogleAccount(token);
    if (result.success) {
      addNotification({message:"Google account successfully linked", variant: 'success'});
    }
  };

  const handleGoogleLoginError = () => {
    addNotification({message:"An error occurred while auth attempt via Google", variant: 'danger'});
  };
 useEffect(() => {
    const fetchJoinedEvents = async () => {
      setLoadingJoinedEvents(true);
      const result = await getJoinedEvents();

      if (result.success) {
        setJoinedEvents(result.data || []);
      } else {
        console.error('An error occured while fetching joined events');
      }

      setLoadingJoinedEvents(false);
    };

    fetchJoinedEvents();
  }, []);

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEventById(eventId);
      setCreatedEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch {
      addNotification({
        message: "An error occured while deleting event",
        variant: "danger",
      });
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await updateUserProfile(
        (({ email, ...rest }) => rest)(formData)
      );
      if (result.success) {
        addNotification({
          message: "Profile successfully updated",
          variant: "success",
        });
        setUserProfile((prev) => ({ ...prev, ...formData }));
      }
    } catch {
      addNotification({
        message: "An error occured while updating profile",
        variant: "danger",
      });
    }
  };

  const handleSendEmailConfirmation = async () => {
    setEmailConfirming(true);
    try {
      const result = await sendEmailConfirmation();
      if (result.success) {
        addNotification({
          message: "The confirmation email has been sent successfully",
          variant: "success",
        });
      }
    } catch {
      addNotification({
        message: "An error occurred while sending the confirmation email",
        variant: "danger",
      });
    }
    setEmailConfirming(false);
  };

  const handleSendPasswordReset = async (email) => {
    setPasswordResetting(true);
    try {
      const result = await sendPasswordResetEmail(email);
      if (result.success) {
        addNotification({
          message: "The password reset email has been sent successfully",
          variant: "success",
        });
      }
    } catch {
      addNotification({
        message: "An error occurred while sending the password reset email",
        variant: "danger",
      });
    }
    setPasswordResetting(false);
  };

  const handleLogoutClick = () => {
    handleLogout();
    localStorage.clear();
    navigate("/");
  };

  const handleUpdateEvent = (id, updatedData) => {
    setCreatedEvents((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, ...updatedData } : ev))
    );
  };

  if (loadingProfile) return <div>Profile loading...</div>;

  return (
    <div className="profile-wrapper">
      <div className="container my-2">
        <div className="pt-4">
          <BreadCrumbs
            items={[{ label: "Home", path: "/" }, { label: "Profile" }]}
          />
        </div>
        <h1 className="fw-bold mb-2 px-2">Profile</h1>
      </div>
      <div className="profile-container">
        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-info-left">
              <AvatarUpload
                avatarPath={userProfile.avatarPath}
                setAvatarPath={(path) => {
                  setUserProfile((prev) => ({ ...prev, avatarPath: path }));
                  addNotification({
                    message: "Avatar successfully updated",
                    variant: "success",
                  });
                }}
              />
            </div>
            <div className="profile-info-right">
              <h3 className="profile-nickName" style={{ marginBottom: "20px" }}>
                <span>
                  {userProfile.nickname?.trim() ? userProfile.nickname : "User"}
                </span>
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
              <p className="profile-firstName">
                First name: {userProfile.firstName || "—"}
              </p>
              <p className="profile-lastName">
                Last name: {userProfile.lastName || "—"}
              </p>
              <p className="profile-biography">
                Bio: {userProfile.bio || "—"}
              </p>
            </div>

            <ProfileStatistics
              totalParticipated={totalEventsParticipated}
              totalHosted={totalEventsSuccessfullyHosted}
            />
          </div>

          <div className="profile-tabs-container">
            <Tab.Container id="profile-tabs" defaultActiveKey="details">
              <Nav variant="tabs" className="profile-tabs-nav">
                <Nav.Item>
                  <Nav.Link eventKey="details" title="Profile">
                    <FaUserCircle size={20} />
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="myevents" title="My Events">
                    <FaRegCalendarCheck size={20} />
                  </Nav.Link>
                </Nav.Item>
                  <Nav.Item>
                  <Nav.Link eventKey="joinedevents" title="Joined Events">
                    <FaUsers size={20} />
                  </Nav.Link>
                </Nav.Item>
                  <Nav.Item>
                  <Nav.Link eventKey="favouritegames" title="Favorite Games">
                    <FaHeart size={20} />
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="recommendations" title="Recommendations">
                    <FaStar size={20} />
                  </Nav.Link>
                </Nav.Item>
                 <Nav.Item>
                  <Nav.Link eventKey="settings" title="Settings">
                    <FaCog size={20} />
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content className="profile-tabs-content">
                <Tab.Pane eventKey="details">
                  <ProfileDetails
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                  />
                </Tab.Pane>

                <Tab.Pane eventKey="myevents">
                  <CreatedEventsTab
                    loading={loadingCreatedEvents}
                    events={createdEvents}
                    onDelete={handleDeleteEvent}
                    onUpdate={handleUpdateEvent}
                  />
                </Tab.Pane>

                   <Tab.Pane eventKey="joinedevents">
                  <JoinedEventsTab
                  events={joinedEvents}
                  loading={loadingJoinedEvents}
                />
                </Tab.Pane>

                <Tab.Pane eventKey="recommendations">
                  <RecommendationsTab />
                </Tab.Pane>

                <Tab.Pane eventKey="favouritegames">
                  <FavoriteGames />
                </Tab.Pane>

                <Tab.Pane eventKey="settings">
                  <div className="settings-container">
                    <h2 className="fw-bold text-dark">Account Settings</h2>
                  <hr className="mb-4" />
                    <div className="google-login-wrapper mb-3 d-flex align-items-center gap-3">
                      <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={handleGoogleLoginError}
                      />
                      <span className="text-muted small">Link your Google account for easy login</span>
                    </div>

                    <Button
                      variant="outline-primary"
                      className="w-100 mb-3"
                      onClick={handleSendPasswordReset}
                      disabled={passwordResetting}
                    >
                      {passwordResetting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Sending...
                        </>
                      ) : (
                        "Send Password Reset Email"
                      )}
                    </Button>

                    <Button
                      variant="danger"
                      className="w-100"
                      onClick={handleLogoutClick}
                    >
                      Logout
                    </Button>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
