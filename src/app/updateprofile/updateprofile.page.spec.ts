import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdateprofilePage } from './updateprofile.page';

describe('UpdateprofilePage', () => {
  let component: UpdateprofilePage;
  let fixture: ComponentFixture<UpdateprofilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateprofilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
