getCases(
  {
    remote: true,
    query: 'type_of_case=Children Undergoing Reintegration',
  },
  state => {
    return { ...state, childrenUndergoingReintegration: state.data };
  }
);

getCases(
  {
    remote: true,
    query: 'age<18',
  },
  state => {
    return { ...state, ageUnder18: state.data };
  }
);
