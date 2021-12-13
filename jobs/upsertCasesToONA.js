fn(state => {
  state.applyMapping = primeroCase => {
    return {
      cases: primeroCase.case_id_display,
      registration_date: primeroCase.registration_date,
      case_source: primeroCase.oscar_number || 'primero',
      disabled: primeroCase.disability_type,
      sex: primeroCase.sex,
      age: primeroCase.age,
      placement_type: primeroCase.type_of_placement,
      province: primeroCase.location_caregiver,
      district: primeroCase.location_caregiver,
    };
  };
  return state;
});

fn(state => {
  const data = [...state.data.childrenUndergoingReintegration, ...state.data.ageUnder18];
  return { ...state, onaData: data.map(state.applyMapping) };
});

each('onaData[*]', state => {
  return upsert('cases', 'cases', state.data, { logValues: true })(state);
});
