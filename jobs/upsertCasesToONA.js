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

  const serviceTypeMap = {
    social_work_case_work: 'Social Work / Case Work',
    family_based_care: 'Family Based Care',
    drug_alcohol: 'Drug / Alcohol',
    counselling: 'Counselling',
    financial_development: 'Financial Development',
    disability_support: 'Disability Support',
    medical_support: 'Medical Support',
    legal_support: 'Legal Support',
    mental_health_support: 'Mental Health Support',
    training_education: 'Training and Education',
    family_support: 'Family Support',
    anti_trafficking: 'Anti-Trafficking',
    residential_care_gov_only: "Residential care (Gov't only)",
    other: 'Other',
  };

  const disabilityTypeMap = {
    no: 'Physical Disability (Hand Disability)',
    mental_disability: 'Physical Disability (Feet Disability)',
    physical_disability: 'Physical Disability (Body or Back Disability)',
    both: 'Hearing or Speech Disability',
    vision_disability_33985: 'Vision Disability',
    intellectual_disability_including_mental_disability_19364:
      'Intellectual Disability (including mental disability)',
    other_28672: 'Other',
  };

  const sexMap = {
    male: 'Male',
    female: 'Female',
    other: 'Other',
  };

  const deduplicate = (arr, id) => {};

  // TODO: remove this deduplication step

  const { cases } = state;
  //console.log(`from ${cases.length} initial cases we have...`);

  state.cases = Array.from(new Set(cases.map(c => c.case_id_display))).map(
    id => {
      return cases.find(c => c.case_id_display === id);
    }
  );

  return { ...state, protectionMap, serviceTypeMap, disabilityTypeMap, sexMap };
});

sql(() => 'select * from locations_lookup');

fn(state => {
  const locations_lookup = state.response.body.rows;

  console.log(`...we have ${state.cases.length} cases to load.`);

  return { ...state, locations_lookup };
});

upsertMany(
  'cases',
  'case_id',
  state =>
    state.cases.map(c => {
      const { locations_lookup } = state;

      const setViaLocation = (arr, searchVal, attributeToReturn) => {
        const result = arr.find(l => l.code == searchVal);

    
        if (result) {console.log("RESULT"); console.log(result); console.log("attributeToReturn"); console.log(result[attributeToReturn]); return result[attributeToReturn]};
        return null;
      };
    
      
      // console.log('case_id_display ::', c.case_id_display);
      // console.log('record id ::', c.id);

      const placement = c.type_of_placement;
      //console.log('placement ::', placement);
      const formattedPlacement =
        placement && placement.split('_').slice(0, -1).join(' ');
      //console.log('formatted placement ::', formattedPlacement);

      const protectionConcerns = [];
      const protections = c.protection_concerns || [];
      //console.log('protections ::', protections);
      protections.forEach(protection => {
        //console.log('each protection ::', protection);
        protectionConcerns.push(state.protectionMap[protection]);
      });
      const translatedProtectionConcerns = protectionConcerns.join(', ');
      // console.log(
      //   'output for protection_concerns ::',
      //   translatedProtectionConcerns
      // );

      const location = c.location_current;
      const districtCode =
        (location && location.length === 3) ||
        (location && location.length === 5) ||
        (location && location.length === 7)
          ? location.substring(0, 3)
          : location
          ? location.substring(0, 4)
          : location;
      console.log('district code ::', districtCode);

      const locationCaregiver = c.location_caregiver;
      const districtCaregiverCode =
        (locationCaregiver && locationCaregiver.length === 3) ||
        (locationCaregiver && locationCaregiver.length === 5) ||
        (locationCaregiver && locationCaregiver.length === 7)
          ? locationCaregiver.substring(0, 3)
          : locationCaregiver
          ? locationCaregiver.substring(0, 4)
          : locationCaregiver;
     // console.log('Caregiver district code ::', districtCaregiverCode);

      return {
        //case_id: c.case_id,
        case_id: c.case_id_display,
        registration_date: c.registration_date,
        case_source: c.oscar_number ? 'oscar' : 'primero',
        disabled: state.disabilityTypeMap[c.disability_type],
        type_of_case:
          c.type_of_case && c.type_of_case.split('_').slice(0, -1).join(' '),
        sex: state.sexMap[c.sex] || c.sex,
        age: c.age,
        protection_concerns: translatedProtectionConcerns,
        placement_type: formattedPlacement,
        consent_for_reporting: c.consent_reporting
          ? c.consent_reporting
          : 'false',
        // Here we look for the related locations on the locations_lookup table
        // e.g., if c.location_current == '10060802'
        // province == '10' (Kratie)
        // district == '1006' (Chetr Borei)
        location_code: c.location_current,
        
        province_current: setViaLocation(
          locations_lookup,
          districtCode,
          'province'
        ),
        province_current_code: setViaLocation(
          locations_lookup,
          districtCode,
          'province_code'
        ),
        district_current: setViaLocation(
          locations_lookup,
          districtCode,
          'district'
        ),
        district_current_code: setViaLocation(
          locations_lookup,
          districtCode,
          'district_code'
        ),
        province_caregiver: setViaLocation(
          locations_lookup,
          districtCaregiverCode,
          'province'
        ),
        province_caregiver_code: setViaLocation(
          locations_lookup,
          districtCaregiverCode,
          'province_code'
        ),
        district_caregiver: setViaLocation(
          locations_lookup,
          districtCaregiverCode,
          'district'
        ),
        district_caregiver_code: setViaLocation(
          locations_lookup,
          districtCaregiverCode,
          'district_code'
        )
      };
    }),
  { writeSql: true, logValues: true }
);

fn(state => {
  const allServices = state.cases
    .map(c => {
      //const case_id = c.case_id;
      const case_id = c.case_id_display;
      const services =
        c.services_section &&
        c.services_section.map(service => ({
          case_id: case_id,
          unique_id: service.unique_id,
          service_type: state.serviceTypeMap[service.service_type],
          service_date:
            service.service_implemented_day_time === 'not implemented'
              ? null
              : service.service_implemented_day_time,
        }));
      return services;
    })
    .flat()
    .filter(service => service !== undefined);

  //console.log(`from ${allServices.length} services we have...`);

  const deDuplicatedServices = Array.from(
    new Set(allServices.map(s => s.unique_id))
  ).map(id => {
    return allServices.find(s => s.unique_id === id);
  });

  //console.log(`we get... ${deDuplicatedServices.length} deduplicated services`);

  return { ...state, allServices: deDuplicatedServices };
});

upsertMany('services', 'unique_id', state => state.allServices);

fn(state => {
  return { ...state };
});
