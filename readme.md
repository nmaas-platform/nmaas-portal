# NMaaS Portal (GUI)

### Web-based GUI for browsing, subscription and deployment of network management applications offered by the NMaaS system

### Issues
---
As of Angular 9, there is an issue with ```ivy``` and ```ngcc```, regarding ```angular-formio```, however everything seems to be working fine.  
See [Github Issue](https://github.com/formio/angular-formio/issues/485)

The application is maintained through quite some period of time, so there are still some legacy and problematic packages (updated: 2021-09-15):
1. `angular-formio` is basically not maintained, there is a dependency clash (it requires old angular version), it must be usually updated with `--force` flag, however it does not break (yet). In future new versions may emerge since they are present in git repository, however they are not yet deployed to `npm`. New versions will likely require angular v12. Note: `angular-formio` is very much **required**.
2. `ngx-pagination` can be replaced with `primeng` counterpart,
3. `ng-recaptcha` can be updated to the newest version with angular update,
4. `angular-password-strength-meter` (probably not maintained anymore) can be replaced with `primeng` component and removed together with its dependencies (`zxcvbn`, `zxcvbn3`),
5. `bootstrap` - project uses `bootstrap v3` however updating bootstrap **is not advised**,
6. There are other packages, that are deprecated, e.g. `codelyzer`. However, they *should* not cause much harm.

### Technologies
---

* Angular
* Bootstrap 3
* PrimeNG
* Formio

See `package.json` for detailed package list.

### Prerequisites
---
 + Install node and npm
 + Install git
 + Clone project and run `npm install` in project *root* directory
 + (running on server) Build project using `ng build` and deploy using http server of your choice
 + (running tests) Chrome is required for running tests, however `karma-chrome-launcher` should download Chrome automatically if it is not detected. Run test using `npm test` or `npm test-headless`. See `package.json` for detailed test commands.

### Running NMaaS Portal locally
---
Go to`nmaas-portal` directory in terminal or command line
Run command `npm start` or `ng serve`
After successful compilation go to `http://localhost:4200` in your browser (do not close terminal or command line)
Note: First run requires entering `npm install` command in order to install all of missing dependencies

### Running NMaaS Portal on dedicated machine
---
  In order to run NMaaS Portal on dedicated machine perform the following steps:
  + Build the NMaaS Portal by running `gradlew clean build` in the reactor directory.
    - In order to build for production environment use additional option `-Pprod`
  + The output archive `nmaas-portal-x.x.x.zip` file is created in `nmaas-portal/build/distributions` directory.
  + Run the http server in `nmaas-portal/build/app`
    - `nohup angular-http-server -p 9009 -s --cors > nmaas-portal.log 2> Error.err < /dev/null &`

### Lunching tests
---
Run `./gradlew run testCoverage` in this directory.
Results of executed tests are displayed on screen. 
More information about code quality (including code coverage, test status) are available in *nmaas-portal/coverage/index.html*

### Default settings
---
NMaaS Portal and Platform URLs:
+ Portal: `http://<HOSTNAME>:9009`
+ Platform API: `http://<HOSTNAME>:9001/api`

Admin user:
+ username: `admin`
+ password: `admin`
    
### Building and uploading NMaaS Portal Docker image
---
In order to build the NMaaS Portal Docker image first alter the `build_and_publish.sh` script with custom REPOSITORY, PACKAGE and TAG values and execute *build_and_publish.sh* to automatically build and publish `nmaas-portal` image to selected Docker repository.
