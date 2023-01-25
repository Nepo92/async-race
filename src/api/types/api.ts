export interface APIConfig {
  process: (e: ProgressEvent) => void;
  contentType: string;
  toJson: boolean;
  method: string;
  body: object;
  headers: Array<Array<string>>;
}
