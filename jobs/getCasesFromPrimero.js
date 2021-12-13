getCases(
  {
    remote: true,
    query: 'type_of_case=Children Undergoing Reintegration',
  },
  state => ({ ...state, childrenUndergoingReintegration: state.data });
);

getCases(
  {
    remote: true,
    query: 'age<18',
  },
  state => ({ ...state, ageUnder18: state.data, references: [] })
);
