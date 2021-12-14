fn(state => {
  const yS = new Date(new Date().getFullYear(), 0, 1);
  const yE = new Date(new Date().getFullYear(), 11, 31);
  console.log(`Getting cases between ${yS} and ${yE}`);
  return { ...state, yS, yE };
});

getCases(
  {
    remote: true,
    query: 'type_of_case=Children Undergoing Reintegration',
  },
  state => ({ ...state, cases: [...state.data] })
);

getCases(
  {
    remote: true,
    query: 'age<18',
  },
  state => ({
    ...state,
    cases: [...state.cases, ...state.data],
    references: [],
  })
);
