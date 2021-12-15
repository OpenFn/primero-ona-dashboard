each(
  'cases[*]',
  upsert('cases', 'case_id', c => ({
    case_id: c.case_id_display,
    registration_date: c.registration_date,
    case_source: c.oscar_number || 'primero',
    disabled: c.disability_type,
    sex: c.sex,
    age: c.age,
    placement_type: c.type_of_placement,
    province: c.location_caregiver,
    district: c.location_caregiver,
  }))
);