import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordsearchComponent } from './wordsearch.component';

describe('WordsearchComponent', () => {
  let component: WordsearchComponent;
  let fixture: ComponentFixture<WordsearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordsearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
