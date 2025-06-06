const EventPlayerCard = ({ player }) => {
  const initials = `${player.firstName?.[0] ?? ''}${player.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem',
        padding: '0.5rem 0.75rem',
        borderRadius: '12px',
        backgroundColor: '#fff',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
        cursor: 'default',
        userSelect: 'none',
        transition: 'background-color 0.25s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f4f8')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: '#495057',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '700',
          fontSize: '1.25rem',
          marginRight: '1rem',
          flexShrink: 0,
          userSelect: 'none',
        }}
      >
        {initials}
      </div>
      <span style={{ fontSize: '1.1rem', color: '#212529' }}>
        {(player.firstName || '') + ' ' + (player.lastName || '')}
      </span>
    </li>
  );
};

export default EventPlayerCard;