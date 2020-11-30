# Setup

Install dependencies and the migration tool :
```sh
npm i
npm i -g db-migrate db-migrate-mysql
```
Copy the environnement variables : 
```
cp .env.sample .env
```
This `.env` file allows to change the way the Node server connects to the database, but you probably won't have to change any of those variables unless you want to deploy the app yourself or connect it to a specific DB.

## With Docker (recommanded)

Install Docker and docker-compose on your OS.

### Linux (Unbuntu 20.04)

Copy and execute those commands one by one in a terminal and you should be good to go.

#### Docker-engine

```sh
# Clean previous docker installation
sudo apt-get remove docker docker-engine docker.io containerd runc
# Update package list
sudo apt-get update
# Install docker dependencies
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg-agent \
    software-properties-common
# Download docker's GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
# Add docker stable repo
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
# Update package list
sudo apt-get update
# Install docker packages
sudo apt-get install docker-ce docker-ce-cli containerd.io
# Add your user to docker's group, so you won't have to use "sudo" to execute Docker
sudo usermod -aG docker $USER
# At this point, you might need to logout and login again (or restart your machine)
# To test that docker is properly setup, you can run :
docker run -it hello-world
# It should print a "hello world" message
```
#### Docker-compose

```sh
# Get the docker-compose binaries
sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
# Link command to binary 
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```

### Windows / MacOS

You can install Docker-engine & Docker-compose via [Docker-Desktop](https://www.docker.com/products/docker-desktop).

### Run the app

```sh
docker-compose up
```
That will install and run the app with all its dependencies (including the DB) in isolated containers. With this single command, you will have a fully functionnal and persistant API listening by default on [localhost:5000](http://localhost:5000). 

You will also have two running DB servers (one for developpement and one for running automated tests), accessible respectively on `localhost:3307` and `localhost:3308` with the user `root` and the password `root`.

### Run the automated tests
```sh
npm run test:setup-and-run
```
Once you've exectued the previous command, you can just do : 
```sh
npm run test
```
It will just execute the tests without settting up the DB and running the migrations.

## Without Docker

Install MySQL on your OS and create two databases on your MySQL instance :
- p3_api_database
- p3_api_database_test

Then, change the `DB_*` variables in `.env` file to match your own MySQL DB settings

### Run the app

```sh
npm run migrate-db
npm run start:watch
```

### Run the automated tests

```sh
npm run test:migrate-db
npm run test
```

# Database migrations

If, while developping, you must change the structure of the database to fit new requirements, 
you HAVE TO write a database migration script in order for the changes to be propagated 
in contributors local databases but also in the pre-prod/prod environments' DBs.

Here's an exemple of the helper command usage : 
```
NAME=splitNameOnUsers npm run create-db-migration
```
(Replace the NAME variable value by the name of your change). It will create two SQL files in the `migrations/sqls` folder. One file is executed on the DB when applying changes (migrating up) and the other is run when rolling back changes (migrating down).

To apply the changes that have not yet been synced to the database :
```
npm run migrate-db
```

# API Docs
You can access the docs, available by default at [localhost:5000/api-docs](http://localhost:5000/api-docs).

You can modify the docs by changing the `docs/swagger.yaml` file.

