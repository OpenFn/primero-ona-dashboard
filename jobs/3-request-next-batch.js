// Your job goes here.
fn(state => {
  const { metadataForAgeRequest, metadataForTypeofCaseRequest } = state;
  // decide if next round is important
  const pageNextRoundDecision = metadata => {
    const { total, per, page } = metadata;

    const pageDataRequested = per * page;

    if (total > pageDataRequested) {
      metadata['page'] = metadata['page'] + 1;
      return metadata;
    }

    return { ...metadata, getcases: false };
  };

  const pageNextRoundPayload = {
    trigger: 'Job 0/3 Succeeds',
    metadataForAgeRequest: pageNextRoundDecision(metadataForAgeRequest),
    metadataForTypeofCaseRequest: pageNextRoundDecision(
      metadataForTypeofCaseRequest
    ),
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