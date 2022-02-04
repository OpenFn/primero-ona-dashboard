each(
  'cases[*]',
  upsert('cases', 'case_id', c => ({
    case_id: c.data.case_id_display,
    registration_date: c.data.registration_date,
    case_source: c.data.oscar_number || 'primero',
    disabled: c.data.disability_type,
    sex: c.data.sex,
    age: c.data.age,
    protection_concern:
      c.data.protection_concerns && c.data.protection_concerns.join(','),
    
    placement_type: c => c.data.placement_type && c.data.placement_type.split("_").slice(0, -1).join(" ")
    // province: c.data.location_caregiver || c.data.location_current,
    // district: c.data.location_caregiver || c.data.location_current,
  }))
);

fn(state => {
  console.log("PLACEMENT");
  console.log(state.data.placement_type);
  return state;
});

fn(state => {
  const allServices = state.cases
    .map(c => {
      const case_id = c.case_id_display;
      const services =
        c.services_section &&
        c.services_section.map(service => ({
          case_id: case_id,
          unique_id: service.unique_id,
          service_type: service.service_type,
          service_date: service.service_implemented_day_time === 'not implemented' ? null : service.service_implemented_day_time,
        }));
      return services;
    })
    .flat()
    .filter(service => service !== undefined);

  return { ...state, allServices };
});

each(
  'allServices[*]',
  upsert('services', 'unique_id', state => state.data)
);
