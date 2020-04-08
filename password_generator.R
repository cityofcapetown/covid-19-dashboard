library(readr)
library(dplyr)
library(tidyr)
library(stringr)
library(jsonlite)
email_addresses <- read.table("users", col.names = c("email_address"))
users <- email_addresses %>% 
  separate("email_address",into = c("username"), sep = "[@]", remove = F, extra = "drop") %>% 
  mutate(username = tolower(username))

system("cat /usr/share/dict/words > words.txt")
words <- read.table("words.txt", col.names = c("word")) %>% 
  pull(word) %>% 
  as.character(.) %>% 
  tolower() %>% 
  str_replace_all("[^[:alnum:]]", "")
words <- words[nchar(words) < 8]
words <- words[nchar(words) > 3]

words2 <- words

users$password <- paste(sample(words, nrow(users)), sample(words2, nrow(users)), sep = "-")

hashes <- vector()
for (i in seq_along(1:length(users$password))) {
  hash <- system(paste("echo ",users$password[i],"| openssl passwd -1 -salt covid "), intern = TRUE)
  hashes <- append(hashes, hash)
}
hashes
users$hashes <- hashes
write_csv(users, "users_passwords.csv")

users %>% mutate(htpasswd = paste("    ", username, ":", hashes, sep = "")) %>% pull(htpasswd) %>% write("htpasswd")

users %>% select(-hashes) %>% toJSON() %>% write("covid-users.json")
