import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FingerprintLockPage } from './fingerprint-lock.page';

describe('FingerprintLockPage', () => {
  let component: FingerprintLockPage;
  let fixture: ComponentFixture<FingerprintLockPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FingerprintLockPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FingerprintLockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
