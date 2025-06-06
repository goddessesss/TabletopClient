import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

function ProfileDetails({ formData, handleInputChange, handleSubmit }) {
  return (
    <div className="mb-4">
      <h2 className="fw-bold text-dark">Profile Details</h2>
      <hr className="mb-4" />

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName || ""}
                onChange={handleInputChange}
                placeholder="Enter your first name"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName || ""}
                onChange={handleInputChange}
                placeholder="Enter your last name"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="nickname">
              <Form.Label>Nickname</Form.Label>
              <Form.Control
                type="text"
                name="nickname"
                value={formData.nickname || ""}
                onChange={handleInputChange}
                placeholder="Enter your nickname"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                placeholder="Email not editable"
                disabled
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="bio" className="mb-3">
          <Form.Label>Biography</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="bio"
            value={formData.bio || ""}
            onChange={handleInputChange}
            placeholder="Write a short bio"
          />
        </Form.Group>

        <Button type="submit" variant="outline-warning">
          Save
        </Button>
      </Form>
    </div>
  );
}

export default ProfileDetails;
