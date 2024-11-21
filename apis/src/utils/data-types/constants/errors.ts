export const UPLOAD_ERRORS = {
  NOT_FOUND: 'uploaded file not found',
  UPLOAD_FAILED: 'upload failed',
};

export const USER_ERRORS = {
  WRONG_PAGE:'wrong page',
  USER_ID_MISSED: 'user id missed',
  NOT_FOUND: 'user not found',
  CREATE_FAILED: 'create user failed',
  UPDATE_FAILED: 'update user failed',
  EMAIL_OR_PHONE_IS_EXISTED: 'email or phone number is existed in system',
  AT_LEAST_ONE_STUDENT: 'you need to have at least one student to register',
  CODE_EXPIRED: 'verify code has been expired',
  WRONG_CODE: 'verify code is wrong',
  LIMIT_ONE_MINUTE: 'Try again after 1 minute',
  LOGIN_FAILED: 'login failed',
};

export const AUTH_ERRORS = {
  UNAUTHORIZED: 'unauthorize error',
  AUTHORIZATION_MISSED: 'authorization header missed',
  JWT_INVALID: 'jwt invalid',
};

export const ROLE_ERRORS = {
  NOT_FOUND: 'role not found',
  ROLE_IN_USED: 'role in used',
};
