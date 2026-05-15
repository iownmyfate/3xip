import { Response } from 'express';

export type ExtraResponseInfo = {
  render: (data: any, status?: number, layout?: string) => void;
};
export type CustomResponse = ExtraResponseInfo & Omit<Response, 'render'>;
