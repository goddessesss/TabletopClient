import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export function BreadCrumbs({ items }) {
  const navigate = useNavigate();

  const handleClick = (e, path) => {
    e.preventDefault();
    if (path) {
      navigate(path);
    }
  };

  return (
    <Breadcrumb>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        if (!isLast && item.path) {
          return (
            <Breadcrumb.Item
              key={index}
              linkAs="a"
              href={item.path}
              onClick={(e) => handleClick(e, item.path)}
            >
              {item.label}
            </Breadcrumb.Item>
          );
        } else {
          return (
            <Breadcrumb.Item key={index} active>
              {item.label}
            </Breadcrumb.Item>
          );
        }
      })}
    </Breadcrumb>
  );
}
