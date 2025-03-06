import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

// NG-ZORRO Icons
import { IconDefinition } from '@ant-design/icons-angular';
import { UpOutline, DownOutline } from '@ant-design/icons-angular/icons';

const icons: IconDefinition[] = [UpOutline, DownOutline];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations()
  ]
};
