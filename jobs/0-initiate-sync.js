// post to openfnInboxUrl pageNextRoundPayload
fn(state => {
  const initialMeta = {
    per: 500,
    page: 1,
    getcases: true,
  };
  
  const runStartedAt = new Date().toISOString();
  const manualCursor = `2023-03-26T06:55:31.494Z`;

  const dateCursor = state.lastRunDateTime
    ? `${state.lastRunDateTime}..${runStartedAt}`
    : `${manualCursor}..${runStartedAt}`;

console.log('lastRunDateTime', state.lastRunDateTime)

  const pageNextRoundPayload = {
    trigger: 'Job 0/3 Succeeds',
    metadataForAgeRequest: initialMeta,
    metadataForTypeofCaseRequest: initialMeta,
  };

  console.log(
    'Next round of getCases metadata',
    JSON.stringify(pageNextRoundPayload, null, 2)
  );

  return { ...state, pageNextRoundPayload, dateCursor,
    lastRunDateTime: runStartedAt };
});

post(`${state.configuration.inboxUrl}`, {
  body: state => {
    return state.pageNextRoundPayload;
  },
});
