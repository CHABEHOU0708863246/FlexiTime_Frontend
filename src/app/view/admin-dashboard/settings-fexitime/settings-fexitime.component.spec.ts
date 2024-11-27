import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsFexitimeComponent } from './settings-fexitime.component';

describe('SettingsFexitimeComponent', () => {
  let component: SettingsFexitimeComponent;
  let fixture: ComponentFixture<SettingsFexitimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsFexitimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsFexitimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
