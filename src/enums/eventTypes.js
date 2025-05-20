
export const eventTypes = [
  { id: 0, name: 'GameSession' },
  { id: 1, name: 'Tournament' },
  { id: 2, name: 'Meetup' },
  { id: 3, name: 'Convention' },
  { id: 4, name: 'Other' },
];

export const EventTypeEnum = eventTypes.reduce((acc, cur) => {
  acc[cur.id] = cur.name;
  return acc;
}, {});
