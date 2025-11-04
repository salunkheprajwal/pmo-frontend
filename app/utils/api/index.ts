// Central index that re-exports all page-wise API modules and provides a default compatibility object
export * from './shared'
export * from './auth'
export * from './profile'
export * from './adminUsers'
export * from './organization'
export * from './department'
export * from './role'
export * from './designation'

// Build a default export similar to the previous single-file API default export
import * as auth from './auth'
import * as profile from './profile'
import * as adminUsers from './adminUsers'
import * as organization from './organization'
import * as department from './department'
import * as role from './role'
import * as designation from './designation'

const defaultExport = {
  // auth
  login: auth.login,
  verify: auth.verify,
  resendOtp: auth.resendOtp,
  // profile
  getProfile: profile.getProfile,
  // admin users
  ...adminUsers,
  // organization
  ...organization,
  // department
  ...department,
  // role
  ...role,
  // designation
  ...designation,
}

export default defaultExport
