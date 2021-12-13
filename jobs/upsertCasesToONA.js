fn(state => {  
  const applyMapping = primeroCase => {
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
  
  const { childrenUndergoingReintegration, ageUnder18 } = state.data;
  
  const onaData = [
    ...childrenUndergoingReintegration,
    ...ageUnder18,
  ].map(state.applyMapping);
  
  return { ...state, onaData };
});

each('onaData[*]', upsert('cases', 'cases', state.data));
