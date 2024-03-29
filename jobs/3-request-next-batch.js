// post to openfnInboxUrl pageNextRoundPayload
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

    metadata['getcases'] = false;
    return metadata;
  };

  const metaForAgeReq = pageNextRoundDecision(metadataForAgeRequest);

  const metaForTypeOfCaseReq = pageNextRoundDecision(
    metadataForTypeofCaseRequest
  );

  const shouldTrigger = () => {
    return metaForAgeReq.getcases || metaForTypeOfCaseReq.getcases
      ? 'Job 0/3 Succeeds'
      : null;
  };

  const pageNextRoundPayload = {
    trigger: shouldTrigger(),
    metadataForAgeRequest: metaForAgeReq,
    metadataForTypeofCaseRequest: metaForTypeOfCaseReq,
  };

  if (shouldTrigger() !== null) {
    console.log(
      'Next round of getCases metadata',
      JSON.stringify(pageNextRoundPayload, null, 2)
    );
    return post(`${state.configuration.inboxUrl}`, {
      body: pageNextRoundPayload,
    })(state);
  }

  console.log('No more cases to query');
  return state;
});
