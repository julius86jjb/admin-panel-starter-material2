import { Component, inject, signal } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';

import Swal from 'sweetalert2';
import { UserService } from '../../../modules/usuarios/services/user.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'admin-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styleUrls: ['./modal-imagen.component.scss']
})
export class ModalImagenComponent {

  public imagenSubir: File | any = null;
  public imgTemp: any = null;

  modalImagenService = inject(ModalImagenService);
  fileUploadService = inject(FileUploadService);
  authService = inject(AuthService);


  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
  }

  cambiarImagen(event: any) {
    const file = event.target.files[0]
    this.imagenSubir = file;

    if (!file) {
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    return reader.onloadend = () => {
      this.imgTemp = reader.result;
    }

  }


  async uploadImage() {

    const id = this.modalImagenService.id();
    const tipo = this.modalImagenService.tipo();
    this.fileUploadService.updateImg(this.imagenSubir, tipo, id)
      .subscribe({
        next: (img) => {
          Swal.fire('Saved', 'Profile image updated', 'success');
          if (id === this.authService.currentUser()!._id) {
            this.modalImagenService.nuevaImagenHeader.emit(img)
          }
          this.modalImagenService.nuevaImagen.emit(img)
          this.cerrarModal();
        },
        error: (message) => {
          Swal.fire('Error', message, 'error')
        }
      })
  }
}
