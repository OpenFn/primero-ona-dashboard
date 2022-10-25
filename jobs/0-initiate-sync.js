// post to openfnInboxUrl initialPayload
post(`${state.configuration.inboxUrl}`, {
  body: {
    trigger: 'Job 0/3 Succeeds',
    metadataForTypeofCaseRequest: {
      per: 500,
      page: 1,
    },
    metadataForAgeRequest: {
      per: 500,
      page: 1,
    },
  },
});
