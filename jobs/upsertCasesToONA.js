fn(state => {
  //Mapping table for protection concerns
  const protectionMap = {
    disabled: 'At risk of neglect',
    serious_health_issue: 'Experiencing neglect',
    refugee: 'Separated',
    caafag: 'Orphaned',
    street_child: 'Unaccompanied',
    child_mother: 'In conflict with the law',
    physically_or_mentally_abused: 'Minority / Isolated community',
    living_with_vulnerable_person: 'At risk of sexual exploitation',
    child_headed_household: 'Experiencing sexual exploitation',
    forced_marriage_06791: 'At risk of online sexual exploitation',
    labor_exploitation_78666: 'Experiencing online sexual exploitation',
    worst_form_of_child_labor_44504: 'At risk of substance abuse',
    emotion_abuse_52599: 'Experiencing substance abuse',
    witness_domestic_violence_79996: 'At risk of child kidnapping',
    other_79684: 'Experienced child kidnapping',
    other_01574: 'At risk of trafficking',
    affiliated_associated_to_stigmatized_parents_51727:
      'Experienced trafficking',
    child_marriage_81380: 'At risk of physical violence',
    working_or_living_in_the_street_91509: 'Experiencing physical violence',
    worst_form_of_child_labour_26780: 'At risk of emotional violence',
    witness_of_domestic_abuse_33560: 'Experiencing emotional violence',
    other_51905: 'At risk of sexual violence',
    experienced_sexual_violence_60515: 'Experienced sexual violence',
    delinquent_behavior_99053: 'Delinquent behavior',
    stigmatization_09708: 'Stigmatization',
    at_risk_of_forced_child_marriage_58534: 'At risk of forced/child marriage',
    experienced_forced_child_marriage_85186:
      'Experienced forced/child marriage',
    working_or_living_on_the_street_24528: 'Working or living on the street',
    at_risk_of_child_labour_50927: 'At risk of child labour',
    experiencing_child_labour_10646: 'Experiencing child labour',
    at_risk_of_worst_forms_of_child_labour_40266:
      'At risk of worst forms of child labour',
    experiencing_worst_forms_of_child_labour_64035:
      'Experiencing worst forms of child labour',
    witness_of_violence_05625: 'Witness of violence',
    abandonment_74305: 'Abandonment',
    affected_by_migration_74074: 'Affected by migration',
    gambling_issues_31174: 'Gambling issues',
    other_02531: 'Other',
    _49619: 'Infected by COVID-19',
    _75169: 'Affected by COVID-19',
  };

  return { ...state, protectionMap };
});

each(
  'cases[*]',
  upsert('cases', 'case_id', c => ({
    case_id: c.data.case_id_display,
    registration_date: c.data.registration_date,
    case_source: c.data.oscar_number || 'primero',
    disabled: c.data.disability_type,
    sex: c.data.sex,
    age: c.data.age,
    protection_concerns: c => {
      const protection_concerns = [];
      const protections = c.data.protection_concerns || [];
      c.data.protection_concerns.forEach(protection => {
        protection_concerns.push(c.protectionMap[protection]);
      });
      return protection_concerns.join(', ');
    },
    //We expect that protection_concerns might have multiple values separated by a space (e.g., 'disabled serious_health_issue')
    //TODO: For each protection_concerns value, check protectionMap for the new value to relabel, and then join by ','
    //Example transformation: 'disabled serious_health_issue' --> 'At risk of neglect, Experiencing neglect'
    placement_type: c =>
      c.data.placement_type &&
      c.data.placement_type.split('_').slice(0, -1).join(' '),
    // district_current: await findValue({
    //   uuid: 'district',
    //   relation: 'locations',
    //   where: {
    //     location_code: dataValue('location_current')(state),
    //   },
    // })(state),
    // province: c.data.location_caregiver || c.data.location_current,
    // district: c.data.location_caregiver || c.data.location_current,
  }))
);

fn(state => {
  console.log('PLACEMENT');
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
          service_date:
            service.service_implemented_day_time === 'not implemented'
              ? null
              : service.service_implemented_day_time,
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
