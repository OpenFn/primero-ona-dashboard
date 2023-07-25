fn(state => {
  const runStartedAt = new Date().toISOString();

  const dateCursor = state.lastRunDateTime
    ? `${state.lastRunDateTime}..${runStartedAt}`
    : '2023-03-28T06:55:31.494Z';

  const { metadataForAgeRequest, metadataForTypeofCaseRequest } = state.data;

  console.log('pageForAgeRequest:', metadataForAgeRequest.page);
  console.log('pageForTypeOfCaseRequest:', metadataForTypeofCaseRequest.page);

  return {
    ...state,
    metadataForAgeRequest,
    metadataForTypeofCaseRequest,
    dateCursor,
    lastRunDateTime: runStartedAt,
  };
});

fn(state => {
  const { metadataForTypeofCaseRequest } = state;

  if (!metadataForTypeofCaseRequest.getcases) return state;

  return getCases(
    state => ({
      record_state: true,
      type_of_case: 'children_undergoing_reintegration_55427',
      last_updated_at: state.dateCursor,
      per: 500,
      page: metadataForTypeofCaseRequest.page,
    }),
    null,
    state => {
      const { data, metadata } = state;
      metadataForTypeofCaseRequest['total'] = metadata.total;
      metadataForTypeofCaseRequest['page'] = metadata.page;
      metadataForTypeofCaseRequest['per'] = metadata.per;

      return {
        ...state,
        cases: data,
        metadataForTypeofCaseRequest,
      };
    }
  )(state);
});

fn(state => {
  const { metadataForAgeRequest } = state;

  if (!metadataForAgeRequest.getcases) return state;
  return getCases(
    state => ({
      record_state: true,
      last_updated_at: state.dateCursor,
      age: '0..18',
      per: 500,
      page: metadataForAgeRequest.page,
    }),
    null,
    state => {
      const { data, metadata } = state;
      const typeOfCaseCases = state.cases ? state.cases : [];
      const allCases = [...typeOfCaseCases, ...data];

      console.log('allCases', allCases.length);

      const casesUIDS = allCases.map(c => c.case_id_display);

      const findDuplicates = arr =>
        arr.filter((item, index) => arr.indexOf(item) != index);

      const casesDuplicateUIDS = [...new Set(findDuplicates(casesUIDS))];

      const casesWithDuplicates = casesDuplicateUIDS.map(uid => {
        if (uid.length === 0) {
          console.log('case_id_display is empty');
        } else {
          console.log(uid, 'case_id_display has duplicates');
        }
        return allCases.filter(c => c.case_id_display === uid);
      });
      console.log(
        'cases with the same case_id_display: ',
        JSON.stringify(casesWithDuplicates, null, 4)
      );

      const deDuplicatedCases = Array.from(
        new Set(allCases.map(s => s.case_id_display))
      )
        .map(id => {
          return allCases.find(s => s.case_id_display === id);
        })
        .flat();

      // console.log(
      //   'deDuplicatedCases',
      //   JSON.stringify(deDuplicatedCases, null, 4)
      // );

      console.log('deDuplicatedCases', deDuplicatedCases.length);
      metadataForAgeRequest['total'] = metadata.total;
      metadataForAgeRequest['page'] = metadata.page;
      metadataForAgeRequest['per'] = metadata.per;

      return {
        ...state,
        cases: deDuplicatedCases,
        metadataForAgeRequest,
        casesWithDuplicates,
        references: [],
        response: {},
      };
    }
  )(state);
});
