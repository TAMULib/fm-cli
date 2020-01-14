import { RestService } from './rest.service';
import { Enhancer } from './enhancer.interface';

import { config } from '../config';
import { fileService } from './file.service';

class DataExtractorService extends RestService implements Enhancer {

  public createExtractor(extractor: any): Promise<any> {
    return this.post(`${config.get('mod-data-extractor')}/extractors`, extractor);
  }

  public enhance(path: string, json: any): any {
    const obj = JSON.parse(json);
    if (obj.queryTemplate) {
      if (fileService.exists(`${path}/sql/${obj.queryTemplate}`)) {
        obj.queryTemplate = fileService.read(`${path}/sql/${obj.queryTemplate}`).trim();
        if (obj.queryTemplate.endsWith(';')) {
          obj.queryTemplate = obj.queryTemplate.slice(0, -1);
        }
      }
    }
    return JSON.stringify(obj);
  }

}

export const modDataExtractor = new DataExtractorService();
