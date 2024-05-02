import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SnakeCaseInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Convert request body keys from camelCase to snake_case
    if (request.body) {
      const newBody = this.convertKeysToSnakeCase(request.body);
      request = request.clone({
        body: newBody,
      });
    }

    return next.handle(request).pipe(
      // Convert response body keys from snake_case to camelCase
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.body) {
            const newBody = this.convertKeysToCamelCase(event.body);
            return event.clone({ body: newBody });
          }
        }
        return event;
      })
    );
  }

  private convertKeysToSnakeCase(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.convertKeysToSnakeCase(item));
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc: any, key) => {
        const snakeCaseKey = key.replace(
          /[A-Z]/g,
          (letter) => `_${letter.toLowerCase()}`
        );
        acc[snakeCaseKey] = this.convertKeysToSnakeCase(obj[key]);
        return acc;
      }, {});
    } else {
      return obj;
    }
  }

  private convertKeysToCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.convertKeysToCamelCase(item));
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc: any, key) => {
        const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) =>
          letter.toUpperCase()
        );
        acc[camelCaseKey] = this.convertKeysToCamelCase(obj[key]);
        return acc;
      }, {});
    } else {
      return obj;
    }
  }
}
