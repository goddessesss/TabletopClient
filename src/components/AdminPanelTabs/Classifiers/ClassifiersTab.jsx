import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import ClassifierSubTab from './ClassifierSubTab';

const TABS = [
  { key: 'categories', label: 'Categories', singleLabel: 'Category' },
  { key: 'designers', label: 'Designers', singleLabel: 'Designer' },
  { key: 'mechanics', label: 'Mechanics', singleLabel: 'Mechanic' },
  { key: 'publishers', label: 'Publishers', singleLabel: 'Publisher' },
  { key: 'subcategories', label: 'Subcategories', singleLabel: 'Subcategory' },
  { key: 'themes', label: 'Themes', singleLabel: 'Theme' },
];

function ClassifiersTab() {
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const activeTabObj = TABS.find(t => t.key === activeTab);

  return (
    <>
      <Nav variant="tabs">
        {TABS.map(t => (
          <Nav.Item key={t.key}>
            <Nav.Link
              active={activeTab === t.key}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      <div className="mt-4">
        <ClassifierSubTab
          type={activeTab}
          label={activeTabObj.label}
          singleLabel={activeTabObj.singleLabel}
        />
      </div>
    </>
  );
}

export default ClassifiersTab;