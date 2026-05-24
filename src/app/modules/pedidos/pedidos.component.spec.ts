import { TestBed, ComponentFixture } from '@angular/core/testing';
import { PedidosComponent } from './pedidos.component';

describe('PedidosComponent', () => {
  let component: PedidosComponent;
  let fixture: ComponentFixture<PedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidosComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PedidosComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the component', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement).toBeTruthy();
  });
});
