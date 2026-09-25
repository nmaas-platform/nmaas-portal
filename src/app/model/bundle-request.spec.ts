import { BundleBasic } from './bundle-basic';
import {BundleDescription} from './bundle-description';

describe('BundleBasic', () => {

  it('should create an instance', () => {

    expect(new BundleBasic('name','codename',[],[])).toBeTruthy();
  });
});
