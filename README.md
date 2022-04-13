<img width="684" alt="image" src="https://user-images.githubusercontent.com/80456839/163181830-a752bf25-0013-4368-89b4-98a7724350b3.png">

# Primero <> ONA Dashboard Sync for Indicator Monitoring

UNICEF is currently using an ONA-built Canopy-based dashboard to visualize integrated child protection-related indicators. This integration allows UNICEF to link specific indicators from this dashboard with aggregated data from Primero, to be extracted on an annual basis.

**The two indicators being covered in this solution are:**
- 4.8 Number of children provided with family reunification or kinship, or community-based care placements
- 4.11a Number of children receiving case management support (Primero)

Please see this data diagram for a review of the solution:   
- (PDF) - [Data Flow Diagram PDF Copy](https://drive.google.com/drive/folders/1IyBPiECLr2nmurzshzdfWV8OeweGgNAY?usp=sharing)  
- (Lucidchart) - [Data Flow Diagram Lucidchart](https://lucid.app/lucidchart/f7f7607f-8cb0-46d3-b00a-a4171a5ee823/edit?invitationId=inv_dfb0977f-5c8b-48ed-9678-58e7016b795d&page=k9buV_utGYNG#)

The mapping specifications for both indicators can be found via this link under the "mappings to DB" tabs ([see mapping specs](https://docs.google.com/spreadsheets/d/1mDMpH87JWPqPXMNTIXMFl0Uxu2yCPWI5tzuhCcexPIg/edit#gid=990515176)). 

Check out this [presentiation](https://docs.google.com/presentation/d/1zk7wRrk-_G7t4I7B86nm7pQJDXiaGOWV5yvq__zVNpo/edit#slide=id.g1012a526bde_0_514) on the project overiew for more information. 


## Data Flow
This is an automated flow which is triggered by a cron job scheduled to run on Jan 1st, every year. 
1. This **first job** _fetches newly created cases in Primero and posts that data to the OpenFn inbox._ (The data is fetched twice in this one job to meet the requirements for both indicators.)
2. These messages will then trigger the **second job**, _which maps and upserts that data to the ONA database._ 



## Adaptors
1. `language-primero` to access Primero
2. `language-postgres` to access PostgreSQL ONA database


## Assumptions & Considerations for Change Management
1. OpenFn is fetching ALL Primero cases where for **indicator 1: "type_of_case" = "Children Undergoing Reintegration"** and for **indicator 2: Age < 18 years.** Any further disegregation of these indicators will be completed in the ONA database. 
2. OpenFn will perform upsert() (update if record exists, create if new) operations in the ONA database when syncing data. To ensure no duplicate cases are entered, OpenFn will use the below identifiers to check for existing cases. We assume that these identifiers are unique.

- `case_id` for the `cases` table in ONA 
- `unique_id` for the `services` table in ONA
3. The `locations_lookup` table can be used to look up the codes that will be stored in the `province_caregiver`, `provice_current`, `district_caregiver`, `district_current` fields
4. The `data_dicitonary` table can be used to determine the Primero label for each column in the `cases` and `services` tables


### Support
Contact support@openfn.org.


View the full documentation at: https://openfn.github.io/primero-ona-dashboard/
