fn(state => {
  const yS = new Date(new Date().getFullYear(), 0, 1);
  const yE = new Date(new Date().getFullYear(), 11, 31);
  console.log(`Getting cases between ${yS} and ${yE}`);
  return { ...state, yS, yE };
});

getCases(
  {
    remote: true,
    query: `type_of_case = Children Undergoing Reintegration AND created_at >= ${state.yS} AND created_at < ${state.yE}`,
  },
  state => ({ ...state, cases: [...state.data] })
);

getCases(
  {
    remote: true,
    query: `age < 18 AND created_at >= ${state.yS} AND created_at < ${state.yE}`,
  },
  state => ({
    ...state,
    cases: [...state.cases, ...state.data],
    references: [],
  })
);
