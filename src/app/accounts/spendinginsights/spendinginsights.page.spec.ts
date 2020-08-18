import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SpendingInsightsPage } from './spendinginsights.page';

describe('SpendingInsightsPage', () => {
  let component: SpendingInsightsPage;
  let fixture: ComponentFixture<SpendingInsightsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpendingInsightsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SpendingInsightsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
