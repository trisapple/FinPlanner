import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FxratesPage } from './fxrates.page';

describe('FxratesPage', () => {
  let component: FxratesPage;
  let fixture: ComponentFixture<FxratesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FxratesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FxratesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
