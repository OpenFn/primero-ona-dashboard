getCases(
  {
    remote: true,
    type_of_case: 'Children Undergoing Reintegration',
    created_at: '2021-01-01T00:00:00.000Z..2021-12-31T23:59:00.000Z',
    per: 100000000,
  },
  state => ({ ...state, cases: [...state.data] })
);

getCases(
  {
    remote: true,
    created_at: '2021-01-01T00:00:00.000Z..2021-12-31T23:59:00.000Z',
    age: '0..18',
    per: 100000000,
  },
  state => ({
    ...state,
    cases: [...state.cases, ...state.data],
    references: [],
  })
);
