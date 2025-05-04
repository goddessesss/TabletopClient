import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

function ProfileDetails({ formData, handleInputChange, handleSubmit }) {
  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder={formData.firstName ? "" : "Nothing to display"}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder={formData.lastName ? "" : "Nothing to display"}
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
              value={formData.nickname}
              onChange={handleInputChange}
              placeholder={formData.nickname ? "" : "Nothing to display"}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={formData.email ? "" : "Nothing to display"}
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group controlId="bio" className="mb-3">
        <Form.Label>Biography</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={formData.bio}
          onChange={handleInputChange}
          placeholder={formData.bio ? "" : "Nothing to display"}
        />
      </Form.Group>
      <Button type="submit" variant="outline-warning">Save</Button>
    </Form>
  );
}

export default ProfileDetails;
