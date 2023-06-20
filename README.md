<img width="684" alt="image" src="https://user-images.githubusercontent.com/80456839/163181830-a752bf25-0013-4368-89b4-98a7724350b3.png">

# Primero <> ONA Dashboard Sync for Indicator Monitoring

UNICEF is currently using an ONA-built Canopy-based dashboard to visualize integrated child protection-related indicators. This integration allows UNICEF to link specific indicators from this dashboard with aggregated data from Primero, to be extracted on an annual basis.

**The two indicators being covered in this solution are:**
- 4.8 Number of children provided with family reunification or kinship, or community-based care placements
- 4.11a Number of children receiving case management support (Primero)

The mapping specifications for both indicators can be found via this link under the "mappings to DB" tabs ([see mapping specs](https://docs.google.com/spreadsheets/d/1mDMpH87JWPqPXMNTIXMFl0Uxu2yCPWI5tzuhCcexPIg/edit#gid=990515176)). 

**Check out this [presentation](https://docs.google.com/presentation/d/1zk7wRrk-_G7t4I7B86nm7pQJDXiaGOWV5yvq__zVNpo/edit#slide=id.g1012a526bde_0_514) on the project overview for more information.**

**Demo ONA Dashboard for preview:** [https://app.akuko.io/post/572db7b9-e2d7-4bbc-afe9-08c36b6ea57d](https://app.akuko.io/post/572db7b9-e2d7-4bbc-afe9-08c36b6ea57d)


## Data Flow
This is an automated flow that is triggered by a cron job scheduled to run on Jan 1st, of every year. 
1. This **first job** _fetches newly created cases in Primero and posts that data to the OpenFn inbox._ (The data is fetched twice in this one job to meet the requirements for both indicators.)
2. These messages will then trigger the **second job**, _which maps and upserts that data to the ONA database._ 

Please see this data diagram for a review of the solution:   
**[Data Flow Diagram](https://lucid.app/lucidchart/f7f7607f-8cb0-46d3-b00a-a4171a5ee823/edit?invitationId=inv_dfb0977f-5c8b-48ed-9678-58e7016b795d&page=k9buV_utGYNG#) (Lucidchart Link)** 
<img width="1122" alt="image" src="https://user-images.githubusercontent.com/80456839/221149369-5ca8ea4f-4603-4bf4-8dca-bcd041fa8e5a.png">



## Adaptors
1. `language-primero` to access Primero
2. `language-postgres` to access PostgreSQL ONA database


## Assumptions & Considerations for Change Management
1. The ONA production database can only be accessed via a static IP that was provided by OpenFn. However, the ONA team was not able to provide a range of IPs for OpenFn to direct traffic to--their IP is not statically assigned and may change. For future runs of this workflow, it might be necessary for OpenFn to request the current ONA IP address before the sync is successful.
2. OpenFn is fetching ALL Primero cases where for **indicator 1: "type_of_case" = "Children Undergoing Reintegration"** and for **indicator 2: Age < 18 years.** Any further disegregation of these indicators will be completed in the ONA database. 
3. The `locations_lookup` table can be used to look up the codes that will be stored in the `province_caregiver`, `provice_current`, `district_caregiver`, `district_current` fields
4. The `data_dicitonary` table can be used to determine the Primero label for each column in the `cases` and `services` tables. This table also includes the Khmer translations for each `field` name and `option value` name. The translations are used by the ONA team to generate dashboards in both English and Khmer. 
5. OpenFn will perform upsert() (update if record exists, create if new) operations in the ONA database when syncing data. To ensure no duplicate cases are entered, OpenFn will use the below identifiers to check for existing cases. We assume that these identifiers are unique.
- `case_id` for the `cases` table in ONA 
- `unique_id` for the `services` table in ONA


### Support
Contact support@openfn.org.


View the full documentation at: [https://openfn.github.io/primero-ona-dashboard/](https://openfn.github.io/primero-ona-dashboard/)
