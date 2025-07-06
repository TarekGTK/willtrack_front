import { Component, ViewChild } from '@angular/core';
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { DropzoneConfigInterface, DropzoneModule } from "ngx-dropzone-wrapper";
import { ModalDirective, ModalModule } from "ngx-bootstrap/modal";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { SharedModule } from "../../../../shared/shared.module";
import { UiSwitchModule } from "ngx-ui-switch";
import { Store } from "@ngrx/store";
import {
  addinstructorgridData, deleteinstructorgridData,
  fetchinstructorgridData,
  updateinstructorgridData
} from "../../../../store/Learning-instructor/instructor.action";
import { selectgridData } from "../../../../store/Learning-instructor/instructor.selector";
import { cloneDeep } from "lodash";
import { Offre } from "../../../../core/model/offre.model";
import { OffreService } from "../../../../core/services/offre.service";
import { of } from "rxjs";
import { DomSanitizer } from '@angular/platform-browser';
import {user} from "@angular/fire/auth";

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [
    BsDropdownModule,
    DropzoneModule,
    ModalModule,
    PaginationModule,
    ReactiveFormsModule,
    RouterLink,
    SharedModule,
    UiSwitchModule
  ],
  templateUrl: './offer-UserJOB.component.html',
  styleUrl: './offer-UserJOB.component.scss'
})
export class OfferUserJOBComponent {
  term: any
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  instuctoractivity: any;
  files: File[] = [];
  deleteID: any;

  GridForm!: UntypedFormGroup;
  submitted = false;
  masterSelected!: boolean;
  instructorGrid: any
  instructors: any;
  img?: any;
  @ViewChild('addInstructor', { static: false }) addInstructor?: ModalDirective;
  @ViewChild('deleteRecordModal', { static: false }) deleteRecordModal?: ModalDirective;
  @ViewChild('editOffre', { static: false }) editOffre?: ModalDirective;

  editData: any;


  offres: Offre[] = [];
  currentUserLocal: any;

 // itemsPerPage = 2; // Set the number of items per page
  paginatedOffres: Offre[] = [];


  constructor(private formBuilder: UntypedFormBuilder, public store: Store, private offreService: OffreService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {


    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      this.currentUserLocal = JSON.parse(userJson);
    }


    this.offreService.getAllOffres().subscribe(data => {
      const jobOffers = data.filter((offer: any) => offer.offerType === 'JOB');

      // Assign filtered offers to this.offres
      this.offres = jobOffers;

      // Log the filtered offers
      console.log(jobOffers);

      // Paginate the filtered offers
      this.paginatedOffres = jobOffers;
      this.offres = this.paginatedOffres.slice(0, 5);



      this.offres.forEach((offre: Offre) => {
        this.getUserImage(offre);
      });
    });
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Instructors', active: true },
      { label: 'Grid View', active: true }
    ];

    /**
     * Form Validation
     */
    this.GridForm = this.formBuilder.group({
      id: [''],
      titre: ['', [Validators.required]], // Change name to titre
      description: ['', [Validators.required]], // Add description control
      startDate: ['', [Validators.required]], // Add startDate control
      endDate: ['', [Validators.required]], // Add endDate control
      offerType: ['', [Validators.required]], // Add offerType control
      active: [true], // Add active control
      user: [this.currentUserLocal], // Add user control
    });

    // Fetch Data
    setTimeout(() => {
      this.store.dispatch(fetchinstructorgridData());
      this.store.select(selectgridData).subscribe((data) => {
        this.instructors = data;
        this.instructorGrid = data;
        this.instructors = cloneDeep(this.instructorGrid.slice(0, 10));
      });
      document.getElementById('elmLoader')?.classList.add('d-none')
    }, 1000)
  }

  getUserImage(offre: Offre) {
    if (offre.user.photoProfile !== undefined) {
      this.offreService.getImage(offre.id).subscribe((data: Blob) => {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
          offre.img = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
        }, false);

        if (data) {
          reader.readAsDataURL(data);
        }
      }, (error: any) => {
        console.log(error);
      });
    } else {
      console.log('photoProfile is undefined for user:', offre.user);
    }
  }

  createNewOffre() {
  if (this.GridForm.valid) {
    const newOffre: Offre = {
      id: this.GridForm.get('id')?.value,
      titre: this.GridForm.get('titre')?.value,
      description: this.GridForm.get('description')?.value,
      startDate: this.GridForm.get('startDate')?.value,
      endDate: this.GridForm.get('endDate')?.value,
      duration: this.calculateDuration(this.GridForm.get('startDate')?.value, this.GridForm.get('endDate')?.value),
      offerType: this.GridForm.get('offerType')?.value,
      active: true,
      user: this.currentUserLocal, // Assuming currentUser is set elsewhere in the component
      img: this.GridForm.get('img')?.value
    };

    this.offreService.createOffre(newOffre).subscribe(response => {
      console.log('Offre created successfully', response);
      this.addInstructor?.hide();
      this.GridForm.reset();
      this.uploadedFiles = [];
      this.refreshOffres(); // Refresh the list after deleting

    }, error => {
      console.log('Error creating offre', error);
    });
  }
}

private calculateDuration(startDate: Date, endDate: Date): number {
  return Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
}
  // File Upload
  public dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
  };

  uploadedFiles: any[] = [];

  // File Upload
  imageURL: any;
  onUploadSuccess(event: any) {
    setTimeout(() => {
      this.uploadedFiles.push(event[0]);
      this.GridForm.controls['img'].setValue(event[0].dataURL);
    }, 0);
  }

  // File Remove
  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }

  // Edit Data
  editList(id: number) {
    this.uploadedFiles = [];
    this.editOffre?.show();
    const modaltitle = document.querySelector('.modal-title') as HTMLAreaElement;
    modaltitle.innerHTML = 'Edit Offer';
    const modalbtn = document.getElementById('add-btn') as HTMLAreaElement;
    modalbtn.innerHTML = 'Update';

    this.editData = this.offres.find(offre => offre.id === id);
console.log(this.editData)
    if (this.editData) {
      this.uploadedFiles.push({ 'dataURL': this.editData.img, 'name': this.editData.img_alt, 'size': 1024 });
      this.GridForm.patchValue(this.editData);
    }
  }

  // add Product

  saveGrid() {
    if (this.GridForm.valid) {
      const updatedOffre: Offre = {
        id: this.GridForm.get('id')?.value,
        titre: this.GridForm.get('titre')?.value,
        description: this.GridForm.get('description')?.value,
        startDate: this.GridForm.get('startDate')?.value,
        endDate: this.GridForm.get('endDate')?.value,
        duration: this.calculateDuration(this.GridForm.get('startDate')?.value, this.GridForm.get('endDate')?.value),
        offerType: this.GridForm.get('offerType')?.value,
        active: this.GridForm.get('active')?.value,
        user: this.currentUserLocal,
        img: this.GridForm.get('img')?.value
      };

      if (updatedOffre.id) {
        this.updateOffre(updatedOffre.id, updatedOffre);
      } else {
        this.createNewOffre();
      }

      this.addInstructor?.hide();
      this.GridForm.reset();
      this.uploadedFiles = [];
    }
  }
  // Delete Product
  removeItem(id: any) {
    this.deleteID = id
    this.deleteRecordModal?.show()
  }

  confirmDelete() {
    this.offreService.deleteOffre(this.deleteID).subscribe(
      () => {
        console.log('Offre deleted successfully');
        // Handle successful deletion, e.g., refresh the list or show a success message
        this.deleteRecordModal?.hide();
        this.refreshOffres(); // Refresh the list after deleting

      },
      (error) => {
        console.log('Error deleting offre', error);
        // Handle error, e.g., show an error message
      }
    );
  }

  // filterdata
  filterdata() {
  if (this.term) {
    this.offres = this.paginatedOffres.filter((el: Offre) => el.titre.toLowerCase().includes(this.term.toLowerCase()));
  } else {
    this.pageChanged({ page: 1, itemsPerPage: 4 });
  }
  // noResultElement
  this.updateNoResultDisplay();
}

  // no result
 updateNoResultDisplay() {
  const noResultElement = document.querySelector('.noresult') as HTMLElement;
  const paginationElement = document.getElementById('pagination-element') as HTMLElement;
  if (this.term && this.offres.length === 0) {
    noResultElement.style.display = 'block';
    paginationElement.classList.add('d-none');
  } else {
    noResultElement.style.display = 'none';
    paginationElement.classList.remove('d-none');
  }
}



  // Page Changed
  pageChanged(event: any): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.offres = this.paginatedOffres.slice(startItem, endItem);
    this.paginatedOffres.forEach((offre: Offre) => {
      this.getUserImage(offre);
    });
  }

  updateOffre(id: number, offre: Offre): void {
    this.offreService.updateOffre(id, offre).subscribe(
      (updatedOffre) => {
        console.log('Offre updated successfully', updatedOffre);
        // Handle successful update, e.g., refresh the list or show a success message
        this.refreshOffres(); // Refresh the list after deleting
        this.editOffre?.hide();


      },
      (error) => {
        console.log('Error updating offre', error);
        // Handle error, e.g., show an error message
      }
    );
  }
  refreshOffres() {
    this.offreService.getAllOffres().subscribe(data => {
      this.offres = data;
      this.paginatedOffres = data;
      this.offres = this.paginatedOffres.slice(0, 5);

      this.offres.forEach((offre: Offre) => {
        this.getUserImage(offre);
      });
    });
  }


// Add this method in your `OfferAdminComponent` class
isExpired(offre: Offre): boolean {
  const currentDate = new Date();
  const endDate = new Date(offre.endDate);
  return endDate < currentDate;
}




  protected readonly of = of;
  protected readonly user = user;
}
