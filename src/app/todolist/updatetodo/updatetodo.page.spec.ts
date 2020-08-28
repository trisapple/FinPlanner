import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdatetodoPage } from './updatetodo.page';

describe('UpdatetodoPage', () => {
  let component: UpdatetodoPage;
  let fixture: ComponentFixture<UpdatetodoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatetodoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatetodoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
