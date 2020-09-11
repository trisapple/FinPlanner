import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ETFPage } from './etf.page';

describe('ETFPage', () => {
  let component: ETFPage;
  let fixture: ComponentFixture<ETFPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ETFPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ETFPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
