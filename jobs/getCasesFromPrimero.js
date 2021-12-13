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
