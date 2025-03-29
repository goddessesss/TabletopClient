import React from "react";
import "../styles/Profile.css";
import avatar from "../assets/avatar.png";
import { Tab, Nav, Form, Button, Row, Col } from "react-bootstrap";
import { FaStar, FaCalendarCheck } from "react-icons/fa";

function Profile() {
  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile</h2>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-info-left">
            <img src={avatar} alt="Profile" className="profile-image" />
          </div>
          <div className="profile-info-right">
            <h3 className="profile-name" style={{ display: "flex", gap: "8px" }}>
              <span>User</span>
              <span>User</span>
            </h3>
            <p className="profile-registration-date">Registration date: 09.01.2025</p>
            <p className="profile-country">Country: Ukraine</p>
            <p className="profile-city">City: Kyiv</p>
            <p className="profile-email">Email: ivanov@gmail.com</p>
            <p className="profile-phone">Phone: 099090909</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-content">
              <p className="stat-number">4 <FaStar className="stat-icon" /></p>
              <div className="stat-text">
                <p className="stat-title">Rating</p>
                <p className="stat-description">
                  Your rating is based on participant feedback and successful events.
                </p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <p className="stat-number">62 <FaCalendarCheck className="stat-icon" /></p>
              <div className="stat-text">
                <p className="stat-title">Created Events</p>
                <p className="stat-description">Total number of events you have organized.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-tabs-container">
        <Tab.Container id="profile-tabs" defaultActiveKey="profile">
          <Nav variant="tabs" className="profile-tabs-nav">
            <Nav.Item>
              <Nav.Link eventKey="profile">Profile</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="settings">Settings</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="recommendations">Recommendations</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content className="profile-tabs-content">
            <Tab.Pane eventKey="profile">
              <h3 className="profile-details-title">Profile details</h3>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formFirstName">
                      <Form.Label className="profile-form-label">First Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter first name" defaultValue="Ivanov" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formLastName">
                      <Form.Label className="profile-form-label">Last Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter last name" defaultValue="Ivan" />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formPhoneNumber">
                      <Form.Label className="profile-form-label">Phone Number</Form.Label>
                      <Form.Control type="text" placeholder="Enter phone number" defaultValue="099090909" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formEmail">
                      <Form.Label className="profile-form-label">Email</Form.Label>
                      <Form.Control type="email" placeholder="Enter email" defaultValue="ivanov@gmail.com" />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="formCountry">
                      <Form.Label className="profile-form-label">Country</Form.Label>
                      <Form.Control type="text" placeholder="Enter country" defaultValue="Ukraine" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formCity">
                      <Form.Label className="profile-form-label">City</Form.Label>
                      <Form.Control type="text" placeholder="Enter city" defaultValue="Kyiv" />
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </Form>
            </Tab.Pane>
            <Tab.Pane eventKey="settings">
              <h3>Settings</h3>
            </Tab.Pane>
            <Tab.Pane eventKey="recommendations">
              <h3>Recomendations</h3>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </div>
    </div>
  );
}

export default Profile;