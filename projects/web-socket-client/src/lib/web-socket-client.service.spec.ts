import { TestBed } from '@angular/core/testing';

import { WebSocketClientService } from './web-socket-client.service';

describe('WebSocketClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebSocketClientService = TestBed.get(WebSocketClientService);
    expect(service).toBeTruthy();
  });
});
