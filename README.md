# Solution Overview 

UNICEF is currently using an ONA-built Canopy-based dashboard to visualize integrated child protection-related indicators. This integration allows UNICEF to link specific indicators from this dashboard with aggregated data from Primero, to be extracted on an annual basis.

**The two indicators being covered in this solution are:**
- 4.8 Number of children provided with family reunification or kinship, or community-based care placements
- 4.11a Number of children receiving case management support (Primero)

Please see this data diagram for a review of the solution:   
- (PDF) - [Data Flow Diagram PDF Copy](https://drive.google.com/drive/folders/1IyBPiECLr2nmurzshzdfWV8OeweGgNAY?usp=sharing)  
- (Lucidchart) - [Data Flow Diagram Lucidchart](https://lucid.app/lucidchart/f7f7607f-8cb0-46d3-b00a-a4171a5ee823/edit?invitationId=inv_dfb0977f-5c8b-48ed-9678-58e7016b795d&page=k9buV_utGYNG#)

The mapping specifications for both indicators can be found via this link under the "mappings to DB" tabs ([see mapping specs](https://docs.google.com/spreadsheets/d/1mDMpH87JWPqPXMNTIXMFl0Uxu2yCPWI5tzuhCcexPIg/edit#gid=990515176)). 



## Data Flow
This is an automated flow which is triggered by a a cron job scheduled to run on Jan 1st, every year. 
1. This **first job** _fetches newly created cases in Primero and posts that data to the OpenFn inbox._ (The data is fetched twice in this one job to meet the requirements for both indicators.)
2. These messages will then trigger the **second job**, _which maps and upserts that data to the ONA database._ 



## Adaptors
1. `language-primero` to access Primero
2. `language-postgres` to access PostgreSQL ONA databse


## Assumptions & Considerations for Change Management
1. OpenFn is fetching ALL Primero cases where for indicator 1: "type_of_case" = "Children Undergoing Reintegration" and for indicator 2: Age < 18 years. Any further disaggration of these indicators will be completed in the ONA database. 
2. OpenFn will perform upsert() (update if record exists, create if new) operations in the ONA database when syncing data. To ensure no duplicate cases are entered, OpenFn will use the below identifiers to check for existing cases. We assume that these identifiers are unique.

- `case_id` for the `cases` table in ONA 
- `unique_id` for the `services` table in ONA

### Support
Contact support@openfn.org.

