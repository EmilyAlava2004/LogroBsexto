import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopularesPage } from './populares.page';

describe('PopularesPage', () => {
  let component: PopularesPage;
  let fixture: ComponentFixture<PopularesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
