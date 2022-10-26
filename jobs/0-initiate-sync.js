// post to openfnInboxUrl pageNextRoundPayload
fn(state => {
  const initialMeta = {
    per: 500,
    page: 1,
    getcases: true,
  };

  const pageNextRoundPayload = {
    trigger: 'Job 0/3 Succeeds',
    metadataForAgeRequest: initialMeta,
    metadataForTypeofCaseRequest: initialMeta,
  };

  console.log(
    'Next round of getCases metadata',
    JSON.stringify(pageNextRoundPayload, null, 2)
  );

  return { ...state, pageNextRoundPayload };
});

post(`${state.configuration.inboxUrl}`, {
  body: state => {
    return state.pageNextRoundPayload;
  },
});
