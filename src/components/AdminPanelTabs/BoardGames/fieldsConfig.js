export const BOARDGAME_FIELDS = [
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'description',
    label: 'Description',
  },
  {
    key: 'yearPublished',
    label: 'Year Published',
  },
  {
    key: 'gameComplexity',
    label: 'Complexity',
  },
  {
    key: 'minPlayers',
    label: 'Min Players',
  },
  {
    key: 'maxPlayers',
    label: 'Max Players',
  },
  {
    key: 'goodPlayers',
    label: 'Good Players',
    format: arr => (Array.isArray(arr) ? arr.join(', ') : ''),
  },
  {
    key: 'manufacturerStatedPlayTime',
    label: 'Manufacturer Stated Play Time',
  },
  {
    key: 'communityMinPlayTime',
    label: 'Community Min Play Time',
  },
  {
    key: 'communityMaxPlayTime',
    label: 'Community Max Play Time',
  },
  {
    key: 'manufacturerRecommendedAge',
    label: 'Manufacturer Recommended Age',
  },
  {
    key: 'communityRecommendedAge',
    label: 'Community Recommended Age',
  },
  {
    key: 'bggScore',
    label: 'BGG Score',
  },
  {
    key: 'averageRating',
    label: 'Average Rating',
  },
  {
    key: 'rankOverall',
    label: 'Rank Overall',
  },
  {
    key: 'languageDependenceName',
    label: 'Language Dependence',
  },
  {
    key: 'categories',
    label: 'Categories',
    format: (arr) =>
      Array.isArray(arr)
        ? arr.map(item => item.category?.name).join(', ')
        : '',
    source: 'categories',
  },
  {
    key: 'designers',
    label: 'Designers',
    format: (arr) =>
      Array.isArray(arr)
        ? arr.map(item => item.name).join(', ')
        : '',
    source: 'designers',
  },
  {
    key: 'mechanics',
    label: 'Mechanics',
    format: (arr) =>
      Array.isArray(arr)
        ? arr.map(item => item.name).join(', ')
        : '',
    source: 'mechanics',
  },
  {
    key: 'publishers',
    label: 'Publishers',
    format: (arr) =>
      Array.isArray(arr)
        ? arr.map(item => item.name).join(', ')
        : '',
    source: 'publishers',
  },
  {
    key: 'themes',
    label: 'Themes',
    format: (arr) =>
      Array.isArray(arr)
        ? arr.map(item => item.name).join(', ')
        : '',
    source: 'themes',
  },
  {
    key: 'family',
    label: 'Family',
    format: obj => obj?.name ?? '',
    source: 'family',
  }
];