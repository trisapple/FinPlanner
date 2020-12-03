import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AggregatedinsightsPage } from './aggregatedinsights.page';

describe('AggregatedinsightsPage', () => {
  let component: AggregatedinsightsPage;
  let fixture: ComponentFixture<AggregatedinsightsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AggregatedinsightsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AggregatedinsightsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
