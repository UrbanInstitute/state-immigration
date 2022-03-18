# the tool uses a geojson to read the data. The original data is excel files, so first it needs to clean and format the data to a dataframe, then to geojson

# runs the script that includes all the libraries used to build the data
source("scripts/set-up.R")


#### global variables ####
# update if new years are include
theYears <- 2000:2020

# this might need to be updated, depending on newest data. In the 2021 version, when tabs were mutated into lists, the state column was renamed as '...1'. This vector includes it so later the code filters that variable as part of the data. 
thisLists <- c("^...1$", theYears)

# collapse so stringDetect() runs through all the elements
listPaste <- paste(thisLists, collapse="|")

#### functions ####

# allXlsxToDF takes all the tabs in the excel files, selects only those that include "(0, 1)" in their name and creates a nested list. It uses the tab's name To name each list. That name will be later use in a new variable (`policy`) to identify each category. Then it removes all columns that are not necessary to create the tool. It returns a dataframe with all the policies.

# it requires 2 parameters, the path to the file and the range of cells you want to extract. Think of it as in an excel file: A2 to D32. Extract all data from column A cell 2 to column D cell 32.
allXlsxToDF <- function(thisPath, thisRange) {
  sheets <- excel_sheets(thisPath)
  
  listSheets <- sheets[grepl("(0,1)", sheets)] %>%
    set_names() %>%
    map(read_excel, path = thisPath, range = thisRange)
  
  temp <- map(listSheets, ~ keep(.x, .p = str_detect(names(.x), listPaste)))
  
  for(i in seq_along(temp)) {
    
    for(j in seq_along(temp[[i]])) {
      if(names(temp[[i]])[[j]] != "...1" & typeof(temp[[i]][[j]]) == "character") {
        temp[[i]][[j]] <- as.numeric(temp[[i]][[j]])
      }
    }
  }
  
  tempDF <- map_df(temp, ~as.data.frame(.x), .id="policy")
  
  names(tempDF)[2] <- "state"
  
  return(tempDF)
}

# it helps to check if all data is in place and all tabs were included in the dataframe
getUniquePolicies <- function(df, column) {
  temp <- df 
  
  uniquePolicies <- unique(temp[[column]])
  
  # just to check the number of policies matches with what's in the original files
  print(length(uniquePolicies))
  
  return(uniquePolicies)
}


#### build ####

integration <- allXlsxToDF("data-in/Updated_Integration_Policies_Data.xlsx", "A2:V53")
benefits <- allXlsxToDF("data-in/Updated_Public_Benefits_Data.xlsx", "A2:V53")
enforcement <- allXlsxToDF("data-in/Updated_Enforcement_Policies_Data.xlsx", "A2:V53")

# run the next three lines of code only if you want to double-check that all policies were included
uniqueIntegration <- getUniquePolicies(integration, "policy")
uniqueBenefits <- getUniquePolicies(benefits, "policy")
uniqueEnforcement <- getUniquePolicies(enforcement, "policy")

# it adds a new variable `policy_short`, it will be use to filter the csv that includes the description of the policies shown in the tool. If new policies are add, modify the case_when statement
integration <- integration %>%
  mutate(
    policy_short = case_when(
      policy == "In-state tuition (0,1)" ~ "tuition",
      policy == "State financial aid (0,1)"  ~ "financial",
      policy == "Ban from higher educ (0,1)" ~ "ban",
      policy == "English as official lang (0,1)" ~ "english",
      policy == "Driver's Licenses (0,1)" ~ "driver"
    )
  ) %>%
  select(policy, policy_short, state, everything())

enforcement <- enforcement %>%
  mutate(
    policy_short = case_when(
      policy == "287(g) Task Force (0,1)" ~ "task",
      policy == "287(g) Jail (0,1)"  ~ "jail",
      policy == "Secure Communities (0,1)" ~ "scomm",
      policy == "Limited Coop. w Detainers (0,1)" ~ "detainer",
      policy == "E-Verify (0,1)" ~ "e-verify",
      policy == "Limits E-Verify (0,1)" ~ "ban-e-verify",
      policy == "State Omnibus (0,1)" ~ "omnibus",
      policy == "287(g) Warrant (0,1)" ~ "warrant"
    )
  ) %>%
  select(policy, policy_short, state, everything())

benefits <- benefits %>%
  mutate(
    policy_short = case_when(
      policy == "TANF after 5-year bar (0,1)" ~ "tanf",
      policy == "Cash asst dur. 5-year bar (0,1)"  ~ "cash",
      policy == "Food asst LPR kids (0,1)" ~ "food_children",
      policy == "Food asst LPR adults (0,1)" ~ "food_adults",
      policy == "SSI replacement (0,1)" ~ "ssi",
      policy == "Medicaid LPR kids (0,1)" ~ "medicaid",
      policy == "Pub ins unauth kids (0,1)" ~ "health_children",
      policy == "Pub ins LPR adults (0,1)" ~ "health_adults",
      policy == "Medicaid unauth adult (0,1)" ~ "health_undocumented_adults",
      policy == "Medicaid LPR preg (0,1)" ~ "medicaid_lpr_pregnant",
      policy == "Medicaid unauth preg (0,1)" ~ "medicaid_undocumented",
      policy == "Medicaid to LPR >5 (0,1)" ~ "medicaid_lpr_ban"
    )
  ) %>%
  select(policy, policy_short, state, everything())

# just a way to check that when adding adding the short version of the policies, all of them were included. Voluntary use. 
# length(getUniquePolicies(integration, "policy")) == length(getUniquePolicies(integration, "policy_short"))
# length(getUniquePolicies(benefits, "policy")) == length(getUniquePolicies(benefits, "policy_short"))
# length(getUniquePolicies(enforcement, "policy")) == length(getUniquePolicies(enforcement, "policy_short"))

# add two-letter state names
abbrStates <- read_csv("data-in/policy_values_only.csv") %>%
  select(state, abbr)

dfAll <- benefits %>%
  rbind(enforcement, integration) %>%
  select(-policy) %>%
  left_join(abbrStates, by = "state") %>%
  select(state, abbr, everything())

# create new variable names: policy + year (YY format), those will be used to create the tool
dfAllLong <- dfAll %>%
  pivot_longer(4:24, names_to = "year", values_to = "values") %>%
  mutate(
    year_short = str_sub(as.character(year), -2, -1),
    code_year = paste(policy_short, year_short, sep = "_")
  ) %>%
  select(state, abbr, values, code_year)

dfAllWide <- dfAllLong %>%
  pivot_wider(names_from = code_year, values_from = values)

write.csv(dfAllWide, "data-out/all-data.csv", row.names = FALSE, na="")


#### geojson format ####

# geojson with the poligons used to draw the cartogram
map <- readOGR(dsn = "data-in/state_squares.geojson", layer = "state_squares")

# this is unnecessary if you already have dfAllWide
# values_wide <- read_csv("data-out/all-data.csv")
combined_data <- merge(map, dfAllWide, by="abbr", sort = FALSE, all.x = TRUE)
writeOGR(combined_data, dsn="data-out/combined-data.geojson", layer="combined_data", driver="GeoJSON", overwrite_layer = T)
