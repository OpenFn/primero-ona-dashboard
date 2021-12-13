fn(state => {
  const applyMapping = primeroCase => {
    return {
      case_id: primeroCase.case_id_display,
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
  return { ...state, applyMapping };
});

fn(state => {
  const onaData = [
    ...state.data.childrenUndergoingReintegration,
    ...state.data.ageUnder18,
  ].map(state.applyMapping);
  return { ...state, onaData };
});

each('onaData[*]', state => {
  return upsert('cases', 'case_id', state.data)(state);
});
