import { EventEmitter, Injectable, computed, signal } from '@angular/core';
import { environments } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private readonly baseUrl: string = environments.baseUrl;

  public visible = false;
  private _id = signal<string>('');
  private _tipo = signal<string>('');
  private _avatar = signal<string>('');

  public id = computed(() => this._id());
  public tipo = computed(() => this._tipo());
  public avatar = computed(() => this._avatar());

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();
  public nuevaImagenHeader: EventEmitter<string> = new EventEmitter<string>();



  abrirModal(img: string, tipo: string, id: string) {
    this.visible = true
    this._id.set(id)
    this._tipo.set(tipo);
    if (img.includes('https')) {
      this._avatar.set(img);
    } else {
      this._avatar.set(`${this.baseUrl}/${tipo}/profile-image/${img}`);
    }
  }

  cerrarModal() {
    this.visible = false;
  }

  toggleModal() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }
}
