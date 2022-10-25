fn(state => {
  const pageForAgeRequest = state.data.metadataForAgeRequest.page
    ? state.data.metadataForAgeRequest.page
    : 1;

  const pageForTypeOfCaseRequest = state.data.metadataForTypeofCaseRequest.page
    ? state.data.metadataForTypeofCaseRequest.page
    : 1;

  console.log('pageForAgeRequest:', pageForAgeRequest);
  console.log('pageForTypeOfCaseRequest:', pageForTypeOfCaseRequest);

  //TODO: @Mtuchi, use a helper functiondefined in language-common instead
  const dedupArrayOfObjects = (array, uid) => {
    return Array.from(new Set(array.map(a => a[uid]))).map(id => {
      return array.find(a => a[uid] === id);
    });
  };

  return {
    ...state,
    dedupArrayOfObjects,
    pageForAgeRequest,
    pageForTypeOfCaseRequest,
  };
});

getCases(
  {
    remote: true,
    type_of_case: 'children_undergoing_reintegration_55427',
    created_at: '2022-01-01T00:00:00.000Z..2022-12-31T23:59:00.000Z',
    per: 500,
    page: state.pageForTypeOfCaseRequest,
  },
  null,
  state => {
    const { data, metadata } = state;

    return {
      ...state,
      cases: data,
      metadataForAgeRequest: metadata,
    };
  }
);

getCases(
  {
    remote: true,
    created_at: '2022-01-01T00:00:00.000Z..2022-12-31T23:59:00.000Z',
    age: '0..18',
    per: 500,
    page: state.pageForAgeRequest,
  },
  null,
  state => {
    const { cases, data, metadata } = state;
    const allCases = [...cases, ...data];
    // console.log('typeRun', cases);
    // console.log('ageRun', data);

    console.log('allCases', allCases.length);

    const casesUIDS = allCases.map(c => c.case_id);

    const findDuplicates = arr =>
      arr.filter((item, index) => arr.indexOf(item) != index);

    const casesDuplicateUIDS = [...new Set(findDuplicates(casesUIDS))];

    const casesWithDuplicates = casesDuplicateUIDS.map(uid => {
      console.log(uid, 'case_id has duplicates');
      return allCases.filter(c => c.case_id === uid);
    });
    console.log(
      'cases with the same case_id: ',
      JSON.stringify(casesWithDuplicates, null, 4)
    );

    const cleanCases = allCases.filter(
      c => !casesDuplicateUIDS.includes(c.case_id)
    );

    console.log('Cleaned Cases', cleanCases.length);

    return {
      ...state,
      cases: cleanCases,
      metadataForTypeofCaseRequest: metadata,
      casesWithDuplicates,
      references: [],
    };
  }
);
