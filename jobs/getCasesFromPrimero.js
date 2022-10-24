fn(state => {
  const updatePaginationCursor = (cursoName, cursor) => {
    console.log(`Last sync paginantion for '${cursoName}' was page ${cursor}`);

    const manualPaginationCursor = 1;

    const updatedCursor =
      cursor != null && cursor != '' ? cursor++ : manualPaginationCursor;

    console.log(`New pagination for '${cursoName}' is at ${updatedCursor}`);
    return updatedCursor;
  };

  return { ...state, updatePaginationCursor };
});

getCases(
  {
    remote: true,
    type_of_case: 'children_undergoing_reintegration_55427',
    created_at: '2022-01-01T00:00:00.000Z..2022-12-31T23:59:00.000Z',
    per: 500,
    page: state.typeOfCaseLastRun,
  },
  null,
  state => {
    const { data, updatePaginationCursor, typeOfCaseLastRun } = state;
    if (data.length > 0) {
      // Update cursor for typeOfCaseLastRun
      const updateTypeOfCaseLastRun = updatePaginationCursor(
        'typeOfCaseLastRun',
        typeOfCaseLastRun
      );
      return {
        ...state,
        cases: [data],
        typeOfCaseLastRun: updateTypeOfCaseLastRun,
      };
    }
    console.log(
      `No more cases to sync for 'type_of_case: 'children_undergoing_reintegration_55427'',`
    );
    console.log('The latest pagination cursor was at', state.typeOfCaseLastRun);
    return state;
  }
);

getCases(
  {
    remote: true,
    created_at: '2022-01-01T00:00:00.000Z..2022-12-31T23:59:00.000Z',
    age: '0..18',
    per: 500,
    page: state.ageLastRun,
  },
  null,
  state => {
    const { data, updatePaginationCursor, ageLastRun } = state;
    if (data.length > 0) {
      // Update cursor for ageLastRun
      const updateAgeLastRun = updatePaginationCursor('ageLastRun', ageLastRun);
      return {
        ...state,
        cases: [...state.cases, data],
        references: [],
        ageLastRun: updateAgeLastRun,
      };
    }
    console.log(`No more cases to sync for 'age: '0..18''`);
    console.log('The latest pagination cursor was at', state.ageLastRun);
    return state;
  }
);

// fn(state => {
//   let { lastRunPagination } = state;
//   lastRunPagination++;

//   console.log('Next sync start pagination:', lastRunPagination);
//   return { ...state, lastRunPagination };
// });
// add a fn block that add's an attribute to state.
// And later use that attribute in the next run of the job.
