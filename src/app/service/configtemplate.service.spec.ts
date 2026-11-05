import { TestBed } from '@angular/core/testing';

import { ConfigTemplateService } from './configtemplate.service';
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ConfigtemplateService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [],
    providers: [ConfigTemplateService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}));

  it('should be created', () => {
    const service: ConfigTemplateService = TestBed.inject(ConfigTemplateService);
    expect(service).toBeTruthy();
  });
});

describe('ConfigTemplateService.generateConfigUpdateTemplate', () => {

  let service: ConfigTemplateService;

  const emptyDefaultUpdateTemplate = {
    components: [
      { type: 'container', input: true, key: 'configuration', hideLabel: true, components: [] }
    ]
  };

  // structure based on a real deployment wizard: tabs with config, additional parameters and advanced sections
  const mainWizardTemplate = {
    components: [
      {
        type: 'tabs', key: 'tabs', input: false, components: [
          {
            key: 'configTab', input: false, components: [
              {
                type: 'container', input: true, key: 'accessCredentials', components: [
                  { type: 'textfield', input: true, key: 'accessUsername' },
                  { type: 'password', input: true, key: 'accessPassword' }
                ]
              },
              {
                type: 'container', input: true, key: 'configuration', components: [
                  { type: 'textfield', input: true, key: 'global_scrape' },
                  { type: 'textfield', input: true, key: 'global_evaluation' }
                ]
              }
            ]
          },
          {
            key: 'additionalParametersTab', input: false, components: [
              {
                type: 'container', input: true, key: 'additionalParameters', components: [
                  { type: 'textfield', input: true, key: 'server_dot_extraArgs_dot_"storage\\_dot_tsdb\\_dot_retention\\_dot_time"' }
                ]
              }
            ]
          },
          {
            key: 'advancedTab', input: false, components: [
              {
                type: 'container', input: true, key: 'advanced', components: [
                  { type: 'number', input: true, key: 'storageSpace' }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  beforeEach(() => {
    service = TestBed.inject(ConfigTemplateService);
    // the default empty template is normally loaded from assets via http
    service.configUpdateTemplate = emptyDefaultUpdateTemplate;
  });

  it('should copy updatable containers (accessCredentials, additionalParameters, mandatoryParameters) from the main wizard', () => {
    const generated = service.generateConfigUpdateTemplate(mainWizardTemplate);
    const keys = generated.components.map((component: any) => component.key);
    expect(keys).toEqual(['accessCredentials', 'additionalParameters']);
  });

  it('should not copy the configuration container because config file content cannot be updated from the wizard', () => {
    const generated = service.generateConfigUpdateTemplate(mainWizardTemplate);
    expect(generated.components.some((component: any) => component.key === 'configuration')).toBeFalse();
  });

  it('should not copy the advanced (storage space) container', () => {
    const generated = service.generateConfigUpdateTemplate(mainWizardTemplate);
    expect(generated.components.some((component: any) => component.key === 'advanced')).toBeFalse();
  });

  it('should deep-copy containers so later edits of the update template do not modify the main wizard', () => {
    const generated = service.generateConfigUpdateTemplate(mainWizardTemplate);
    (generated.components[0].components as any[]).push({ type: 'textfield', input: true, key: 'extraField' });
    const mainAccessCredentials =
      (mainWizardTemplate.components[0].components as any[])[0].components[0];
    expect((mainAccessCredentials.components as any[]).some(field => field.key === 'extraField')).toBeFalse();
  });

  it('should copy mandatoryParameters containers as well', () => {
    const mainWizard = {
      components: [
        {
          type: 'container', input: true, key: 'mandatoryParameters', components: [
            { type: 'textfield', input: true, key: 'superuserEmail' }
          ]
        }
      ]
    };
    const generated = service.generateConfigUpdateTemplate(mainWizard);
    expect(generated.components.map((component: any) => component.key)).toEqual(['mandatoryParameters']);
  });

  it('should fall back to the empty default update template when the main wizard has no updatable containers', () => {
    const mainWizard = {
      components: [
        {
          type: 'container', input: true, key: 'configuration', components: [
            { type: 'textfield', input: true, key: 'someField' }
          ]
        }
      ]
    };
    expect(service.generateConfigUpdateTemplate(mainWizard)).toEqual(emptyDefaultUpdateTemplate);
  });

  it('should fall back to the empty default update template when the main wizard is null', () => {
    expect(service.generateConfigUpdateTemplate(null)).toEqual(emptyDefaultUpdateTemplate);
  });

});

describe('ConfigTemplateService.isTemplateEmpty', () => {

  let service: ConfigTemplateService;

  beforeEach(() => {
    service = TestBed.inject(ConfigTemplateService);
  });

  it('should consider a null template empty', () => {
    expect(service.isTemplateEmpty(null)).toBeTrue();
    expect(service.isTemplateEmpty(undefined)).toBeTrue();
  });

  it('should consider the default update template (hidden empty configuration container) empty', () => {
    const template = {
      components: [
        { type: 'container', input: true, key: 'configuration', hideLabel: true, components: [] }
      ]
    };
    expect(service.isTemplateEmpty(template)).toBeTrue();
  });

  it('should consider a template with parameter fields not empty', () => {
    const template = {
      components: [
        {
          type: 'container', input: true, key: 'additionalParameters', components: [
            { type: 'textfield', input: true, key: 'accessmethods_dot_public_dot_healthchecks' }
          ]
        }
      ]
    };
    expect(service.isTemplateEmpty(template)).toBeFalse();
  });

  it('should consider a basic auth only template not empty', () => {
    const template = {
      components: [
        {
          type: 'container', input: true, key: 'accessCredentials', components: [
            { type: 'textfield', input: true, key: 'accessUsername' },
            { type: 'password', input: true, key: 'accessPassword' }
          ]
        }
      ]
    };
    expect(service.isTemplateEmpty(template)).toBeFalse();
  });

  it('should find fields nested in columns', () => {
    const template = {
      components: [
        {
          type: 'columns', input: false, columns: [
            { components: [{ type: 'textfield', input: true, key: 'field' }] }
          ]
        }
      ]
    };
    expect(service.isTemplateEmpty(template)).toBeFalse();
  });

  it('should ignore buttons when looking for input fields', () => {
    const template = {
      components: [
        { type: 'button', input: true, key: 'submit', label: 'Apply configuration' }
      ]
    };
    expect(service.isTemplateEmpty(template)).toBeTrue();
  });

});
