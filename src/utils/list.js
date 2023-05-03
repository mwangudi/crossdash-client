export const sortList = () => {
  const reA = /[^a-zA-Z]/g;
  const reN = /[^0-9]/g;
  const sortAlphaNum = (c, d) => {
    const a = c.name;
    const b = d.name;
    const AInt = parseInt(a, 10);
    const BInt = parseInt(b, 10);

    if (Number.isNaN(AInt) && Number.isNaN(BInt)) {
      const aA = a.replace(reA, '');
      const bA = b.replace(reA, '');
      if (aA === bA) {
        const aN = parseInt(a.replace(reN, ''), 10);
        const bN = parseInt(b.replace(reN, ''), 10);
        // eslint-disable-next-line
        return aN === bN ? 0 : aN > bN ? 1 : -1;
        // eslint-disable-next-line
      } else {
        return aA > bA ? 1 : -1;
      }
    }
    if (Number.isNaN(AInt)) {
      return 1;
    }
    if (Number.isNaN(BInt)) {
      return -1;
      // eslint-disable-next-line
    } else {
      return AInt > BInt ? 1 : -1;
    }
  };
  return sortAlphaNum;
};

export const extractListItems = (resp, item) => [
  ...resp.body.data.map(d => {
    d.relationships[item].data.forEach(r => {
      resp.body.included.forEach(i => {
        if (i.type === item && i.id === r.id) {
          d.attributes[item] = d.attributes[item]
            ? d.attributes[item].filter(s => s.id === i.id).length
              ? [...d.attributes[item]]
              : [...d.attributes[item], { ...i }]
            : [{ ...i }];
        }
      });
    });
    return d;
  }),
];

export const sortByValue = (key, order = 'asc') => (a, b) => {
  // eslint-disable-next-line
  if (!a.hasOwnProperty(key)) {
    return 1;
  }
  // eslint-disable-next-line
  if (!b.hasOwnProperty(key)) {
    return 0;
  }

  const varA = parseInt(a[key], 10);
  const varB = parseInt(b[key], 10);

  let comparison = 0;
  if (varA > varB) {
    comparison = 1;
  } else if (varA < varB) {
    comparison = -1;
  }
  return order === 'desc' ? comparison * -1 : comparison;
};

export const extractItemItems = (resp, item) =>
  resp.body.included
    ? [...resp.body.included.filter(s => s.type === item)]
    : [];

export default {
  sortList,
  extractListItems,
  extractItemItems,
  sortByValue,
};
