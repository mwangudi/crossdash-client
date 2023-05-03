export const computeApiSearchQuery = query => {
  // Replace keys with required keys if necessary
  // e.g. { page: 'current_page' }
  const pMap = {
    metrics: 'metrics[]',
  };
  let replacedQuery = [];
  if (query && query !== undefined && query !== null) {
    replacedQuery = Object.keys(query).map(key => {
      const newKey = pMap[key] || key;
      return { [newKey]: query[key] };
    });
  }
  let formatedQuery = {};
  if (replacedQuery.length)
    formatedQuery = replacedQuery.reduce((a, b) => ({ ...a, ...b }));

  // Compute an api Search Query by equating a search key to its value
  let searchQuery = '';
  Object.entries(formatedQuery).forEach(([key, value]) => {
    formatedQuery[key] = value;
    searchQuery = `${searchQuery + key}=${value}&`;
  });

  return searchQuery;
};

export const computeApiParentScope = payload => {
  // If a parent scope exists, ensure its placed in api call appropriately
  if (payload.parentScope) {
    return `${payload.parentScope}/${payload.fingerprint}/`;
  }
  return '';
};

export default {
  computeApiParentScope,
  computeApiSearchQuery,
};
