each(
  'cases[*]',
  upsert('cases', 'case_id', c => ({
    case_id: c.data.case_id_display,
    registration_date: c.data.registration_date,
    case_source: c.data.oscar_number || 'primero',
    disabled: c.data.disability_type,
    sex: c.data.sex,
    age: c.data.age,
    placement_type: c.data.type_of_placement,
    province: c.data.location_caregiver,
    district: c.data.location_caregiver,
  }))
); 