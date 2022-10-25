// post to openfnInboxUrl initialPayload
post(`${state.configuration.inboxUrl}`, {
  body: {
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
