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
+ Platform API: `http://<HOSTNAME>:9001/api`

Admin user:
+ username: `admin`
+ password: `admin`

### Issues
---
As of Angular 14, there is an issue with ```ivy``` and ```ngcc```, regarding ```angular-formio```, however, everything seems to be working fine.  
See [GitHub Issue](https://github.com/formio/angular-formio/issues/485)

The application is maintained through quite some period of time, so there are still some legacy and problematic packages (updated: 2023-08-03:
1. `angular-formio` is basically not maintained, there is a dependency clash (it requires an old angular version), it must usually be updated with `--force` flag during `npm install` or `npm clean install`. In future new versions may emerge since they are present in the git repository, however, they are not yet deployed for 2 years. Note: `angular-formio` is very much **required**.
2. `ngx-pagination` can be replaced with `primeng` counterpart,
3. `ng-recaptcha` can be updated to the newest version with angular update,
4. `angular-password-strength-meter` (probably not maintained anymore) can be replaced with `primeng` component and removed together with its dependencies (`zxcvbn`, `zxcvbn3`),
5. `bootstrap` - project uses `bootstrap v3` however updating bootstrap **is not advised**,
6. There are other packages, that are deprecated, e.g. `codelyzer`. However, they *should* not cause much harm.
