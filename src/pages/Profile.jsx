import React, { useEffect, useState } from "react";
import { useAuth } from "../components/Context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getUserProfile,
  updateUserProfile,
  sendEmailConfirmation,
  sendPasswordResetEmail,
  getSettings,
  fetchCountries,
  updateCountryLocation,
  fetchCities
} from "../api/profileApi.js";
import {
  getCreatedEvents,
  deleteEventById,
  getJoinedEvents,
} from "../api/eventsApi.js";
import { linkGoogleAccount } from "../api/authApi.js";
import AvatarUpload from "../components/AvatarUpload.jsx";
import ProfileDetails from "../components/ProfileTabs/ProfileDetails.jsx";
import CreatedEventsTab from "../components/ProfileTabs/CreatedEventsTab.jsx";
import RecommendationsTab from "../components/ProfileTabs/RecommendationsTab.jsx";
import FavoriteGames from "../components/ProfileTabs/FavoriteGamesTab.jsx";
import JoinedEventsTab from "../components/ProfileTabs/JoinedEventsTab.jsx";
import ProfileStatistics from "../components/ProfileTabs/ProfileStatistics.jsx";
import { BreadCrumbs } from "../components/BreadCrumbs/BreadCrumbs.jsx";
import { useNotifications } from "../components/NotificationsHandling/NotificationContext.jsx";
import SettingsTab from "../components/ProfileTabs/SettingsTab.jsx";
import { Tab, Nav, Button } from "react-bootstrap";
import {
  FaRegCalendarCheck,
  FaUsers,
  FaCog,
  FaHeart,
  FaUserCircle,
  FaCheckCircle,
  FaStar,
} from "react-icons/fa";

function Profile() {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [settings, setSettings] = useState(null);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);

  const [userProfile, setUserProfile] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    bio: "",
    email: "",
    country: "",
    countryId: null,
    countryCode: "",
    cityId: null,
    cityName: "",
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
    if (result.success) {
      setSettings(result.data);
      setIsEmailConfirmed(result.data.isEmailConfirmed);
    }
  })();
}, []);


useEffect(() => {
  (async () => {
    const result = await getUserProfile();
    if (result.success) {
      const data = result.data;
      setUserProfile(data);
    setFormData((prev) => ({
  ...prev,
  firstName: data.firstName || "",
  lastName: data.lastName || "",
  nickname: data.nickname || "",
  bio: data.bio || "",
  email: data.email || "",
  country: data.location?.countryName || "",
  countryId: data.location?.countryId || null,
  countryCode: data.location?.countryCode || "",
  cityId: data.location?.cityId || null,
  cityName: data.location?.cityName || "",
}));

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
        addNotification({ message: "Error while retrieving events", variant: "danger" });
      }
      setLoadingCreatedEvents(false);
    })();
  }, []);

  useEffect(() => {
    const fetchJoinedEvents = async () => {
      setLoadingJoinedEvents(true);
      const result = await getJoinedEvents();
      if (result.success) setJoinedEvents(result.data || []);
      setLoadingJoinedEvents(false);
    };
    fetchJoinedEvents();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const result = await fetchCountries();
        setCountries(result || []);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
      setLoadingCountries(false);
    })();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const result = await updateUserProfile(
      (({ email, country, countryId, cityId, cityName, countryCode, ...rest }) => rest)(formData)
    );

    if (!result || result.success !== true) {
      addNotification({
        message: "Не вдалося оновити профіль",
        variant: "danger",
      });
      return;
    }

    let countryUpdated = true;
    if (formData.country && formData.countryId) {
      try {
        const locationPayload = {
          country: {
            id: formData.countryId,
            name: formData.country,
          },
        };

        if (formData.cityId && formData.cityName) {
          locationPayload.city = {
            id: formData.cityId,
            name: formData.cityName,
          };
        }

        const locationResult = await updateCountryLocation(locationPayload);

        console.log("updateCountryLocation result:", locationResult);

        if (!locationResult || locationResult.success !== true) {
          countryUpdated = false;
          addNotification({
            message: "Не вдалося оновити місцезнаходження",
            variant: "warning",
          });
        }
      } catch (error) {
        countryUpdated = false;
        console.error("Помилка при оновленні місцезнаходження:", error);
        addNotification({
          message: "Помилка при оновленні країни та міста",
          variant: "danger",
        });
      }
    }

    if (countryUpdated) {
      addNotification({
        message: "Профіль успішно оновлено",
        variant: "success",
      });
    }

    setUserProfile((prev) => ({ ...prev, ...formData }));
  } catch (error) {
    console.error("Помилка під час оновлення профілю:", error);
    addNotification({
      message: "Сталася помилка при оновленні профілю",
      variant: "danger",
    });
  }
};


  const handleSendEmailConfirmation = async () => {
    setEmailConfirming(true);
    try {
      const result = await sendEmailConfirmation();
      if (result.success) {
        addNotification({ message: "Confirmation email sent", variant: "success" });
      }
    } catch {
      addNotification({ message: "Error sending confirmation email", variant: "danger" });
    }
    setEmailConfirming(false);
  };

  const handleSendPasswordReset = async () => {
    if (!formData.email) {
      addNotification({ message: "Enter your email to reset password.", variant: "warning" });
      return;
    }
    setPasswordResetting(true);
    try {
      const result = await sendPasswordResetEmail(formData.email);
      if (result.success) {
        addNotification({ message: "Password reset email sent", variant: "success" });
      }
    } catch {
      addNotification({ message: "Error sending reset email", variant: "danger" });
    }
    setPasswordResetting(false);
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    const result = await linkGoogleAccount(token);
    if (result.success) {
      addNotification({ message: "Google linked", variant: "success" });
    } else {
      addNotification({ message: "Failed to link Google", variant: "danger" });
    }
  };

  const handleGoogleLoginError = () => {
    addNotification({ message: "Google login error", variant: "danger" });
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEventById(eventId);
      setCreatedEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch {
      addNotification({ message: "Error deleting event", variant: "danger" });
    }
  };

  const handleUpdateEvent = (id, updatedData) => {
    setCreatedEvents((prev) => prev.map((ev) => (ev.id === id ? { ...ev, ...updatedData } : ev)));
  };

  const handleLogoutClick = () => {
    handleLogout();
    localStorage.clear();
    navigate("/");
  };

const handleCitySearch = async (countryCode, query) => {
  console.log("🔍 Searching cities for:", countryCode, query);
  if (!countryCode || !query) return [];
  const cities = await fetchCities(countryCode, query);
  console.log("✅ Fetched cities:", cities);
  return cities;
};

  if (loadingProfile) return <div>Loading profile...</div>;

  return (
    <div className="profile-wrapper">
      <div className="container my-2">
        <div className="pt-4">
          <BreadCrumbs items={[{ label: "Home", path: "/" }, { label: "Profile" }]} />
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
                  addNotification({ message: "Avatar updated", variant: "success" });
                }}
              />
            </div>

      <div className="profile-info-right">
  <h3 className="profile-nickName">
    {userProfile.nickname?.trim() ? userProfile.nickname : "User"}
  </h3>
  <p>
    Email: {userProfile.email}{" "}
    {isEmailConfirmed ? (
      <FaCheckCircle style={{ color: "green", marginLeft: "8px" }} title="Email підтверджено" />
    ) : (
      <Button
        variant="outline-primary"
        size="sm"
        className="ms-3"
        onClick={handleSendEmailConfirmation}
        disabled={emailConfirming}
      >
        {emailConfirming ? "Відправляю..." : "Підтвердити"}
      </Button>
    )}
  </p>
<p>
  Name: {(userProfile.firstName || userProfile.lastName)
    ? `${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim()
    : "Unknown User"}
</p>

  <p>Bio: {userProfile.bio || "—"}</p>
  <p>
    Location: {
      (userProfile.location?.countryName || formData.country) +
      ((userProfile.location?.cityName || formData.cityName)
        ? ", " + (userProfile.location?.cityName || formData.cityName)
        : "") || "—"
    }
  </p>
</div>


            <ProfileStatistics
              totalParticipated={totalEventsParticipated}
              totalHosted={totalEventsSuccessfullyHosted}
            />
          </div>

          <Tab.Container defaultActiveKey="profileDetails">
            <Nav variant="pills" className="profile-nav">
              <Nav.Item><Nav.Link eventKey="profileDetails"><FaUserCircle /> Profile</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="createdEvents"><FaRegCalendarCheck /> Created</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="joinedEvents"><FaUsers /> Joined</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="recommendations"><FaStar /> Recommendations</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="favorites"><FaHeart /> Favorites</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="settings"><FaCog /> Settings</Nav.Link></Nav.Item>
            </Nav>

            <Tab.Content className="profile-tab-content">
              <Tab.Pane eventKey="profileDetails">
                 <ProfileDetails
            formData={formData}
            setFormData={setFormData}
            countries={countries}
            loadingCountries={loadingCountries}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCitySearch={handleCitySearch}
          />
              </Tab.Pane>

              <Tab.Pane eventKey="createdEvents">
                <CreatedEventsTab
                  events={createdEvents}
                  onDelete={handleDeleteEvent}
                  loading={loadingCreatedEvents}
                  onUpdate={handleUpdateEvent}
                />
              </Tab.Pane>

              <Tab.Pane eventKey="joinedEvents">
                <JoinedEventsTab events={joinedEvents} loading={loadingJoinedEvents} />
              </Tab.Pane>

              <Tab.Pane eventKey="recommendations">
                <RecommendationsTab />
              </Tab.Pane>

              <Tab.Pane eventKey="favorites">
                <FavoriteGames />
              </Tab.Pane>

          <Tab.Pane eventKey="settings">
  <SettingsTab
    emailConfirming={emailConfirming}
    passwordResetting={passwordResetting}
    isEmailConfirmed={isEmailConfirmed}
    onSendEmailConfirmation={handleSendEmailConfirmation}
    onSendPasswordReset={handleSendPasswordReset}
    onLogout={handleLogoutClick}
    onGoogleLoginSuccess={handleGoogleLoginSuccess}  
    onGoogleLoginError={handleGoogleLoginError} 
  />
</Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </div>
  );
}

export default Profile;
