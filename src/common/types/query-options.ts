export class QueryOptions {
  filter?: any = {};
  sort?: any = null;
  select?: any = null;

  page?: number = 1;
  limit?: number = 24;
  offset?: number | null = null;

  cursor?: boolean = false;
}
