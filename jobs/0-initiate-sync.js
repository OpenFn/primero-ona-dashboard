// Setup initial payload for initialState
// fn(state => {
//   if (!state.data) {
//     const initialPayload = {
//       trigger: 'Job 0/3 Succeeds',
//       per: 500,
//       ageLastRun: 1,
//       typeOfCaseLastRun: 1,
//     };
//     state.data = initialPayload;
//     return state;
//   }
//   return state;
// });

// post to openfnInboxUrl initialPayload
post(`${state.configuration.inboxUrl}`, {
  body: {
    per: 500,
    ageLastRun: 1,
    typeOfCaseLastRun: 1,
  },
});
