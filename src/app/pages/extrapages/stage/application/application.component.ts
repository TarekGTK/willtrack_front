import {Component, OnInit, ViewChild} from '@angular/core';
import {Application} from "../../../../core/model/application.model";
import {ApplicationService} from "../../../../core/services/application.service";
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {UserProfileService} from "../../../../core/services/user.service";
import {OffreService} from "../../../../core/services/offre.service";
import {Offre} from "../../../../core/model/offre.model";
import {DomSanitizer} from "@angular/platform-browser";
import {ModalDirective, ModalModule} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    NgIf,
    NgForOf,
    ModalModule,
    ReactiveFormsModule
  ],
  templateUrl: './application.component.html',
  styleUrl: './application.component.scss'
})
export class ApplicationComponent implements OnInit{

  currentUserLocal: any;
  applications: Application[] = [];
  sortField: string = '';
  sortOrder: boolean = true; // true for ascending, false for descending
  noResultsFound: boolean = false;
  searchResults: any;
  searchTerm: any;
  searchText: any;
  currentUser: any = {};
  img?: any;
  createForm: UntypedFormGroup;
  coverLetterFile: File | undefined;
  cvFile: File | null = null
  selectedApplicationId: number | null = null;



  @ViewChild('createApplicationModal', { static: false }) createApplicationModal!: ModalDirective;


  constructor(
    private formBuilder: UntypedFormBuilder,

    private applicationService: ApplicationService,
    private  userService : UserProfileService ,
    private sanitizer: DomSanitizer,

    private offreService : OffreService)
  {

    this.createForm = this.formBuilder.group({
      coverLetter: [null, Validators.required],
      cv: [null, Validators.required],
      idOffer: [null, Validators.required],
      userId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(
      user => {
        this.currentUser = user;
        console.log(this.currentUser);
        this.getApplicationsByUserId(this.currentUser.id!);
      }
    );

  }

  getApplicationsByUserId(userId: number): void {
    this.applicationService.getApplicationsByUserId(userId).subscribe(
      (applications: Application[]) => {
        this.applications = applications;

        // Fetch offer and user details for each application
        this.applications.forEach(application => {
          // Fetch offer details
          this.offreService.getOffreById(application.offer.id).subscribe(
            (offer: any) => {
              application.offer = offer;
              console.log(application.offer);


              // Fetch user details of the offer
              this.userService.getUserById(offer.user.id).subscribe(
                (user: any) => {
                  application.offer.user = user;
                  console.log(application.offer.user);
                  this.getUserImage(application.offer);

                },
                (error: any) => {
                  console.error('Error retrieving user details', error);
                }
              );
            },
            (error: any) => {
              console.error('Error retrieving offer details', error);
            }
          );
        });
      },
      (error: any) => {
        console.error('Error retrieving applications', error);
      }
    );
  }
  onSort(field: string): void {
    if (this.sortField === field) {
      this.sortOrder = !this.sortOrder;
    } else {
      this.sortField = field;
      this.sortOrder = true;
    }

    this.applications.sort((a, b) => {
      const valueA = a.user[field];
      const valueB = b.user[field];

      if (valueA < valueB) {
        return this.sortOrder ? -1 : 1;
      } else if (valueA > valueB) {
        return this.sortOrder ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  studentSearch(): void {
    if (!this.searchText) {
      this.getApplicationsByUserId(this.currentUser.id!);
      this.noResultsFound = false;

    } else {
      this.searchResults = this.applications.filter((application: any) => {
        const user = application.user;
        return (user.firstname && user.firstname.toLowerCase().includes(this.searchText.toLowerCase()))
          || (user.email && user.email.toLowerCase().includes(this.searchText.toLowerCase()));
      });
      this.applications = this.searchResults;
      this.noResultsFound = this.applications.length === 0;

    }
  }  // Remove Data

  trackByFn(index: number, item: Application): number {
  return item.id; // or any unique identifier
  }

  getUserImage(offre: Offre): void {
    if (offre.user.photoProfile !== undefined) {
      this.offreService.getImage(offre.id).subscribe((data: Blob) => {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
          offre.user.imageToShow = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
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

  deleteApplication(id: number, userId: number): void {
  this.applicationService.deleteApplication(id, userId).subscribe(
    (response: any) => {
      console.log('Application deleted successfully', response);
      // Optionally, refresh the list of applications or handle the UI update
      this.getApplicationsByUserId(this.currentUser.id!);
    },
    (error: any) => {
      console.error('Error deleting application', error);
    }
  );
  }

  onChangeCoverLetter(event: any) {
    this.coverLetterFile = event.target.files[0];
  }

  onChangeCV(event: any) {
    this.cvFile = event.target.files[0];
  }

  openUpdateApplicationModal(applicationId: number): void {
    this.selectedApplicationId = applicationId;
    this.createApplicationModal.show();
  }

  onUpdateApplication(): void {
    if (this.coverLetterFile && this.cvFile && this.selectedApplicationId !== null) {
      this.applicationService.updateApplication(this.coverLetterFile, this.cvFile, this.selectedApplicationId).subscribe(response => {
        console.log('Application updated successfully', response);
        this.createApplicationModal.hide();
      }, error => {
        console.error('Error updating application', error);
      });
    } else {
      console.error('Required fields are missing');
    }
  }



}
