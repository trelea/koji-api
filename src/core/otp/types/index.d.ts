import { CreateEmailResponse } from 'resend';

export type OTPExecuteResponseType = {
  otp: string;
  hashed: string;
  mail: CreateEmailResponse;
  jwt: string;
};

export type OTPExecuteRequestType = {
  length?: number;
  hash: (otp: string) => string;
  to?: string;
};
