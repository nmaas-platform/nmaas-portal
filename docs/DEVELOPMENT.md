# nmaas Portal (GUI)

### Technologies
---

* Angular 21
* PrimeNG 21
* Primeflex
* Formio

See `package.json` for a detailed package list.

### Prerequisites
---
+ Install node and npm
+ Install git
+ Clone project and run `npm install` in project *root* directory
+ (running on server) Build a project using `ng build` and deploy using http server of your choice
+ (running tests) Chrome is required for running tests, however `karma-chrome-launcher` should download Chrome automatically if it is not detected. Run test using `npm test` or `npm test-headless`. See `package.json` for detailed test commands.

### Running nmaas Portal locally
---
Go to`nmaas-portal` directory in terminal or command line
Run command `npm start` or `ng serve`
After successful compilation go to `http://localhost:4200` in your browser (do not close terminal or command line)
Note: First run requires entering `npm install` command to install all the missing dependencies (use `--force` or `--legacy-peer-deps` due to angular-formio)

### Running nmaas Portal on dedicated machine
---
To run the nmaas Portal on a dedicated machine, perform the following steps:
+ Build the nmaas Portal by running `gradlew clean build` in the reactor directory.
  - To build for production environment, use additional option `--configuration production`
+ The output archive `nmaas-portal-x.x.x.zip` file is created in `nmaas-portal/build/distributions` directory.
+ Run the http server in `nmaas-portal/build/app`
  - `nohup angular-http-server -p 9009 -s --cors > nmaas-portal.log 2> Error.err < /dev/null &`

### Lunching tests
---
Run `./gradlew run testCoverage` in this directory.
Results of executed tests are displayed on screen.
More information about code quality (including code coverage, test status) are available in `nmaas-portal/coverage/index.html`

### Default settings
---
nmaas Portal and Platform URLs:
+ Portal: `http://<HOSTNAME>:9009`
+ Platform API: `http://<HOSTNAME>:9001/api/v1`

Admin user:
+ username: `admin`
+ password: `admin`
