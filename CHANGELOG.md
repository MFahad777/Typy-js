# Changelog

All notable changes to this project will be documented in this file.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [v2.2.0](#v220)
  - [Added](#added)
- [v2.1.0](#v210)
  - [Added](#added-1)
- [v2.0.0](#v200)
  - [Added](#added-2)
  - [Changed](#changed)
- [v1.3.0](#v130)
  - [Added](#added-3)
- [v1.2.0](#v120)
  - [Added](#added-4)
- [v1.1.0](#v110)
  - [Added](#added-5)
- [v1.0.1](#v101)
  - [Added](#added-6)
  - [Fixed](#fixed)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## v2.2.0

### Added
- Add `exists` validation.
  - See `validation.exists.test.js` for more detail usage.

## v2.1.0

### Added
- Add `unique` validation.
  - See `validation.unique.test.js` for more detail usage.
- Add `requiredWithKeys` validation.
  - See `validation.requiredwithkeys.test.js` for more detail.

## v2.0.0

### Added
- Every validation ( not sanitizer ) have an extra key called `bail`, which if set to true will stop further validation if the current one fails.
  - See `validation.other.test.js` for more detail.

### Changed
- Error body would contain `path` instead of `param` key.

## v1.3.0

### Added
- Added `after` validation.
  - See `validation.after.test.js`
- Added `afterOrEqual` validation.
  - See `validation.afterorequal.test.js`
- Added `isUUID` validation.
  - See `validation.isuuid.test.js`
- Added `isDate` validation.
  - See `validation.isdate.test.js`
- Added `isValidMongoId` validation.
  - See `validation.isvalidmongoid.test.js`

## v1.2.0

### Added
- Added `same` validation.
  - See `validation.same.test.js`
- Added `requiredWith` validation.
  - See `validation.requiredwith.test.js`
- Added `requiredWithAll` validation.
  - See `validation.requiredwithall.test.js`

## v1.1.0

### Added
- Added `isStrongPassword` validation.
  - See `validation.isstrongpassword.test.js`
- Added `isEmail` validation.
  - See `validation.isemail.test.js`


## v1.0.1

### Added
- Can now select "header" in "checkIn" key.
  - See `validation.isjwt.test.js`

### Fixed
- Fixed README.md
