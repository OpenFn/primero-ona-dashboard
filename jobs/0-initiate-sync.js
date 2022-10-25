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
  const initialMeta = {
    per: 500,
    page: 1,
    getcases: true,
  };

  const metaForAgeReq = metadataForAgeRequest
    ? pageNextRoundDecision(metadataForAgeRequest)
    : initialMeta;

  const metaForTypeOfCaseReq = metadataForTypeofCaseRequest
    ? pageNextRoundDecision(metadataForTypeofCaseRequest)
    : initialMeta;

  const shouldTrigger = () => {
    return metaForAgeReq.getcases && metaForTypeOfCaseReq.getcases
      ? 'Job 0/3 Succeeds'
      : null;
  };

  const pageNextRoundPayload = {
    trigger: shouldTrigger(),
    metadataForAgeRequest: metaForAgeReq,
    metadataForTypeofCaseRequest: metaForTypeOfCaseReq,
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
