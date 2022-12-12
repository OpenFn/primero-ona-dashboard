fn(state => {
  const { metadataForAgeRequest, metadataForTypeofCaseRequest } = state.data;

  console.log('pageForAgeRequest:', metadataForAgeRequest.page);
  console.log('pageForTypeOfCaseRequest:', metadataForTypeofCaseRequest.page);

  return {
    ...state,
    metadataForAgeRequest,
    metadataForTypeofCaseRequest,
  };
});

fn(state => {
  const { metadataForTypeofCaseRequest } = state;

  if (!metadataForTypeofCaseRequest.getcases) return state;

  return getCases(
    {
      enabled: true,
      type_of_case: 'children_undergoing_reintegration_55427',
      created_at: '2022-01-01T00:00:00.000Z..2022-12-31T23:59:00.000Z',
      per: 500,
      page: metadataForTypeofCaseRequest.page,
    },
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
    {
      enabled: true,
      created_at: '2022-01-01T00:00:00.000Z..2022-12-31T23:59:00.000Z',
      age: '0..18',
      per: 500,
      page: metadataForAgeRequest.page,
    },
    null,
    state => {
      const { data, metadata } = state;
      const typeOfCaseCases = state.cases ? state.cases : [];
      const allCases = [...typeOfCaseCases, ...data];

      console.log('allCases', allCases.length);

      const casesUIDS = allCases.map(c => c.case_id);

      const findDuplicates = arr =>
        arr.filter((item, index) => arr.indexOf(item) != index);

      const casesDuplicateUIDS = [...new Set(findDuplicates(casesUIDS))];

      const casesWithDuplicates = casesDuplicateUIDS.map(uid => {
        if (uid.length === 0) {
          console.log('case_id_display is empty');
        } else {
          console.log(uid, 'case_id_display has duplicates');
        }
        return allCases.filter(c => c.case_id === uid);
      });
      console.log(
        'cases with the same case_id_display: ',
        JSON.stringify(casesWithDuplicates, null, 4)
      );

      const deDuplicatedCases = Array.from(
        new Set(allCases.map(s => s.case_id))
      )
        .map(id => {
          return allCases.find(s => s.case_id === id);
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
      };
    }
  )(state);
});
