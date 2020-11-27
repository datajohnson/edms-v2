# eDMS-Q.v2

## Back-end file/submission broker for Drupal or other front-end services

This application consists of a PostgreSQL database and a Node.js API back-end. Front-end services can begin sending data to the collector by POST to:

http://<hostname>:<api_port>/api/collector/<service_name>

On localhost: http://localhost:3000/api/collector/my-service

When that happens, a log record is created and the files are written to a local drive (as defined in the environment variables). The files are encrypted and can be decrypted using the `CollectorLogService.getFilesFor(log)` method. That will return all of attached files as well as the body, which could have been form values or JSON.

## Running the application locally

Start the PostgreSQL database:

Execute: `docker-compose up`

Start the API back-end:

Execute `npm run start:dev`

As long as the database is running, the application will start up and run the migrations to ensure the database tables are available and ready to accept logs.



## Environment variables

For the application to successfully decrypt encrypted files, the same `ENCRYPTION_KEY` and `ENCRYPTION_IV` must be used. They can be passed in as environment variables or through `.env`

You should change the values of `/db/secrets/**` files to match whatever you choose for user/password in your `.env` files.