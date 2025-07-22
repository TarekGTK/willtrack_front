import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import Swal from 'sweetalert2';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { EntretienEventService } from 'src/app/core/services/entretien-event.service';
import { UserProfileService } from 'src/app/core/services/user.service';
export interface EntretienDTO {
  id: number;
  typeEntretien: string;
  dateEntretien: string;
  heureDebut: string;
  heureFin: string;
  lieu: string;
  statusEntretien: string;
}

export interface ApplicationDTO {
  id: number;
  coverLetter: string;
  cv: string;
  statusApplication: string;
  userFullName: string;
  userPhotoUrl: string;
  offerId?: number;
  offerTitle?: string;
  entretiens: EntretienDTO[];

}
@Component({
  selector: 'app-calendar-technical',
  templateUrl: './calendar-technical.component.html',
  styleUrl: './calendar-technical.component.scss'
})
export class CalendarTechnicalComponent {
  @ViewChild('eventModal', { static: false }) eventModal?: ModalDirective;

  calendarOptions!: CalendarOptions;
  entretiensTech: any[] = [];

  techUserId:any;
  selectedStatus: string = 'ALL';
  calendarEvents: any[] = [];  
  formData!: UntypedFormGroup;
  isEditMode = false;
  submitted = false;
  applications: ApplicationDTO[] = [];
  entretiensAll: any[] = [];
  newEventDate: any;
   responsables: any[] = []; 
  selectedRoleType: any = 'RH';
  selectedResponsable: any = null;
  showButtons: boolean = false; 
  selectedEntretien: EntretienDTO | null = null;

  constructor(
    private entretienService: EntretienEventService,
    private fb: UntypedFormBuilder,
    private userProfile:UserProfileService,
  ) {}

  ngOnInit(): void {
    this.formData = this.fb.group({
      applicationId: ['', Validators.required],
      type: [{ value: '', disabled: true }, Validators.required],
      location: ['', Validators.required],
      date: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      responsableId: ['', Validators.required]
    });
    this.userProfile.getCurrentUser().subscribe(user => {
      if (user && user.id != null) {
     
        this.techUserId=user.id
        this.loadEntretiens(); 
      } else {
        console.warn('Utilisateur invalide ou id non défini.');
      }
    });
  }

  loadEntretiens(): void {
    this.entretienService.getAllEntretiensWithApplications().subscribe(apps => {
      const entretiens: any[] = [];
     
      for (const app of apps) {
        for (const entretien of app.entretiens || []) {
          if (entretien.typeEntretien === 'TECHNIQUE' && entretien.idResponsable == this.techUserId) {
            entretiens.push({
              ...entretien,
              applicationId: app.id,
              candidatNom: app.userFullName,
              photoUrl: app.userPhotoUrl,
              statusEntretien: entretien.statusEntretien
            });
          } 
        }
      }

      
      this.entretiensAll = entretiens;
      this.applications = apps;
      this.filterEvents();
      console.log('display the result about entretiensTech ',entretiens)
      this.initCalendar();
    });
  }

  initCalendar(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      editable: true,
      droppable: true,
      
      eventClick: this.handleEventClick.bind(this),
      events: this.calendarEvents,
      eventContent: this.renderEventContent
    };
  }

  renderEventContent(arg: any): any {
    const photoUrl = arg.event.extendedProps.photoUrl || 'assets/images/users/avatar-1.jpg';
    const typeEntretien = arg.event.extendedProps.typeEntretien ;
    const statusEntretien = arg.event.extendedProps.status ;
    
   
    const icons = {
      RH: '👥',
      TECHNIQUE: '💻',
      MANAGER: '📊',
      
    };
  
    const eventTypeIcon = icons[typeEntretien as keyof typeof icons] || '📅';
  
    const customHtml = `
      <div class="d-flex flex-column align-items-start">
        <div class="d-flex align-items-center mb-2">
          <img src="${photoUrl}" class="rounded-circle me-2" width="30" height="30" alt="Photo" />
          <span class="fw-bold">${eventTypeIcon} </span>
        </div>
       
      </div>
    `;
  
    return { html: customHtml };
  }
  filterEvents(): void {
    const filtered = this.selectedStatus === 'ALL'
      ? this.entretiensAll
      : this.entretiensAll.filter(e => e.statusEntretien === this.selectedStatus);
  
    this.calendarEvents = filtered.map(entretien => {
      const eventStart = new Date(entretien.dateEntretien);
      const eventEnd = new Date(eventStart);
  
      return {
        id: entretien.id.toString(),
        title: `${entretien.typeEntretien} - ${entretien.statusEntretien}`,
        start: eventStart,
        end: eventEnd,
        color: this.getColorHex(entretien.statusEntretien),
        extendedProps: {
          location: entretien.lieu,
          applicationId: entretien.applicationId,
          status: entretien.statusEntretien,
          photoUrl: entretien.photoUrl,
          candidatNom: entretien.candidatNom,
          typeEntretien: entretien.typeEntretien
        }
      };
    });
  
    this.initCalendar();
  }

  handleEventClick(clickInfo: EventClickArg): void {
    this.isEditMode = true;
    const start = clickInfo.event.start!;
    const localDate = new Date(start);

    const entretienId = clickInfo.event.id;
    this.entretienService.getEntretienById(entretienId).subscribe(entretien => {
      this.selectedEntretien = entretien; 

      this.selectedResponsable = entretien.responsable;
      this.showButtons = entretien.statusEntretien === 'PLANIFIE';

      this.formData.patchValue({
        applicationId: entretien.application.id,
        type: entretien.typeEntretien,
        location: entretien.lieu,
        date: localDate.toISOString().split('T')[0],
        start: entretien.heureDebut.substring(0, 5),
        end: entretien.heureFin.substring(0, 5)
      });

      const type = entretien.typeEntretien?.toUpperCase();
      if (type === 'RH') {
        this.selectedRoleType = 'RH';
      } else if (type === 'MANAGER') {
        this.selectedRoleType = 'MANAGER';
      } else {
        this.selectedRoleType = 'RECRUTEUR';
      }

      this.eventModal?.show();
    });
  }

  getColorHex(status: string): string {
    switch (status) {
      case 'PLANIFIE': return '#ffc107';
      case 'ACCEPTE': return '#28a745';
      case 'REFUSE': return '#dc3545';
      default: return '#007bff';
    }
  }

  getEntretienIcon(type: string): string {
    switch (type) {
      case 'RH': return '🧑‍💼';
      case 'TECHNIQUE': return '🛠️';
      case 'MANAGER': return '🎯';
      default: return '📅';
    }
  }

  onStatusChange(): void {
    this.filterEvents();
  }

  filteredApplications(): ApplicationDTO[] {
    if (this.selectedStatus === 'ALL') return this.applications;
    return this.applications.filter(app =>
      app.entretiens?.some(e => e.statusEntretien === this.selectedStatus)
    );
  }

  serializeApp(app: ApplicationDTO): string {
    const [prenom = '', nom = ''] = app.userFullName?.split(' ') || [];
    return JSON.stringify({
      applicationId: app.id,
      nom,
      prenom
    });
  }

  getPhoto(profileUrl: string): string {
    return profileUrl ? profileUrl : 'assets/images/users/avatar-1.jpg';
  }

  getSelectedAppName(): string {
    const appId = this.formData?.get('applicationId')?.value;
    const app = this.applications.find(a => a.id === Number(appId));
    return app?.userFullName || '';
  }

  accepterEntretien(): void {
    const entretienId = this.getCurrentEntretienId();
    if (!entretienId) return;
  
    this.entretienService.traiterEntretien(entretienId, true).subscribe({
      next: () => {
        Swal.fire('Succès', 'Entretien accepté', 'success');
        this.eventModal?.hide();
        this.loadEntretiens();
      },
      error: () => {
        Swal.fire('Erreur', 'Impossible d’accepter l’entretien', 'error');
      }
    });
  }
  
  refuserEntretien(): void {
    const entretienId = this.getCurrentEntretienId();
    if (!entretienId) return;
  
    this.entretienService.traiterEntretien(entretienId, false).subscribe({
      next: () => {
        Swal.fire('Succès', 'Entretien refusé', 'success');
        this.eventModal?.hide();
        this.loadEntretiens();
      },
      error: () => {
        Swal.fire('Erreur', 'Impossible de refuser l’entretien', 'error');
      }
    });
  }
  
  private getCurrentEntretienId(): number | null {
    const rawValue = this.formData?.get('applicationId')?.value;
    const appId = rawValue !== null ? Number(rawValue) : null;
  
    if (appId === null || isNaN(appId)) return null;
  
    const entretien = this.entretiensAll.find(e => e.applicationId === appId);
    return entretien?.id ?? null;
  }
}
