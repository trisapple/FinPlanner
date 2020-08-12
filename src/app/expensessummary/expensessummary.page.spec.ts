import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExpensessummaryPage } from './expensessummary.page';

describe('ExpensessummaryPage', () => {
  let component: ExpensessummaryPage;
  let fixture: ComponentFixture<ExpensessummaryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpensessummaryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpensessummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
