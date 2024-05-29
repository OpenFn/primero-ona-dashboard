// post to openfnInboxUrl pageNextRoundPayload
fn(state => {
  const initialMeta = {
    per: 500,
    page: 1,
    getcases: true,
  };

  const runStartedAt = new Date().toISOString();
  const manualCursor = `2024-01-04T03:45:25.209Z`;

  const dateCursor = state.lastRunDateTime
    ? `${state.lastRunDateTime}..${runStartedAt}`
    : `${manualCursor}..${runStartedAt}`;

  const pageNextRoundPayload = {
    trigger: 'Job 0/3 Succeeds',
    metadataForAgeRequest: initialMeta,
    metadataForTypeofCaseRequest: initialMeta,
    dateCursor,
    lastRunDateTime: runStartedAt,
  };

  console.log(
    'Next round of getCases metadata',
    JSON.stringify(pageNextRoundPayload, null, 2)
  );

  return {
    ...state,
    dateCursor,
    pageNextRoundPayload,
    lastRunDateTime: runStartedAt,
  };
});

post(`${state.configuration.inboxUrl}`, {
  body: state => state.pageNextRoundPayload,
});
