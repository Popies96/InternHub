import { TestBed } from '@angular/core/testing';

import { TopicReactionService } from './topic-reaction.service';

describe('TopicReactionService', () => {
  let service: TopicReactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicReactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
