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
  selector: 'app-calendar-rh',
  templateUrl: './calendar-rh.component.html',
  styleUrl: './calendar-rh.component.scss'
})
export class CalendarRhComponent {
  @ViewChild('eventModal', { static: false }) eventModal?: ModalDirective;

  calendarOptions!: CalendarOptions;
  calendarEvents: any[] = [];
  formData!: UntypedFormGroup;
  isEditMode = false;
  submitted = false;
  applications: ApplicationDTO[] = [];
  selectedStatus: string = 'ALL';
  entretiensAll: any[] = [];
  newEventDate: any;
   responsables: any[] = []; 
  selectedRoleType: any = 'RH';
  selectedResponsable: any = null;
  showButtons: boolean = false; 
  selectedEntretien: EntretienDTO | null = null;
  constructor(
    private fb: UntypedFormBuilder,
    private entretienService: EntretienEventService
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
   
    this.loadEntretiens();
  }

  ngAfterViewInit(): void {
    const draggableEl = document.getElementById('external-events');
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: '.draggable-application',
        eventData: (el: HTMLElement) => {
          const data = el.getAttribute('data-application');
          return {
            title: el.innerText,
            extendedProps: {
              applicationData: data
            }
          };
        }
      });
    }
  }

  loadEntretiens(): void {
    this.entretienService.getAllEntretiensWithApplications().subscribe(apps => {
      const entretiens = [];
      for (const app of apps) {
        for (const entretien of app.entretiens || []) {
          entretiens.push({
            ...entretien,
            applicationId: app.id,
            candidatNom: app.userFullName,
            photoUrl: app.userPhotoUrl,
            statusEntretien: entretien.statusEntretien
          });
        }
      }
      this.entretiensAll = entretiens;
      this.applications = apps;
      this.filterEvents();
    });
  }
  loadResponsables(): void {
    const selectedDate = this.formData.get('date')?.value; 
    this.entretienService.getResponsablesDisponibles(selectedDate, this.selectedRoleType).subscribe(
      (responsables: any[]) => {
        this.responsables = responsables;
        console.log('role selct type ')
        console.log('display list of responsable ',responsables)
      },
      error => {
        Swal.fire('Erreur', 'Impossible de charger les responsables', 'error');
      }
    );
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
      eventReceive: this.handleDrop.bind(this),
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
  

  handleDrop(info: any): void {
    const data = info.event.extendedProps?.applicationData;
    if (!data) {
      Swal.fire('Erreur', 'Aucune donnée trouvée', 'error');
      return;
    }
  
    const parsed = JSON.parse(data);
    const applicationId = parsed.applicationId;
    const app = this.applications.find(a => a.id === Number(applicationId));
  
    if (!app) {
      Swal.fire('Erreur', 'Candidature introuvable', 'error');
      return;
    }
  
    if (app.statusApplication === 'REFUSE') {
      Swal.fire('Erreur', 'Cette candidature est refusée.', 'error');
      info.revert?.();
      return;
    }
  
    
    const date = info.event.start;
    const isoDate = date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +  
      String(date.getDate()).padStart(2, '0');             
  
    const time = date.toTimeString().substring(0, 5); 
  
    const accepted = app.entretiens?.filter(e => e.statusEntretien === 'ACCEPTE').length || 0;
    let typeEntretien = 'RH';
    if (accepted === 1) 
    {
      typeEntretien = 'TECHNIQUE';
      this.selectedRoleType='RECRUTEUR'
    }
    else if (accepted >= 2) {
      typeEntretien = 'MANAGER';
      this.selectedRoleType='MANAGER'
    }
  
    this.formData.reset();
    this.formData.patchValue({
      applicationId,
      type: typeEntretien,
      date: isoDate,
      start: time,
      end: time
    });
    this.loadResponsables();
    this.selectedResponsable = null; 
  
    this.isEditMode = false;
    this.newEventDate = date;
    this.submitted = false;
  
    this.eventModal?.show();
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
  
  

  saveEvent(): void {
    this.submitted = true;
    if (this.formData.invalid) return;

    const fd = this.formData.getRawValue();
    const dt = new Date(fd.date);
    const [h, m] = fd.start.split(':').map(Number);
    dt.setHours(h, m);

    this.entretienService.planifierEntretien(
      fd.applicationId,
      fd.type,
      dt,
      fd.location,
      fd.start,
      fd.end,
      fd.responsableId 
    ).subscribe(() => {
      Swal.fire('Succès', 'Entretien planifié', 'success');
      this.eventModal?.hide();
      this.loadEntretiens();
    }, () => {
      Swal.fire('Erreur', 'Échec de planification', 'error');
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

  deleteEvent(): void {
    if (confirm('Voulez-vous vraiment supprimer cet entretien ?')) {
      this.eventModal?.hide();
      this.initCalendar();
    }
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
  modifierDateEntretien(): void {
    this.submitted = true;
    if (this.formData.invalid) return;
  
    const fd = this.formData.getRawValue();
    const entretienId = this.getCurrentEntretienId; 
  
    const dt = new Date(fd.date);
    const [h, m] = fd.start.split(':').map(Number);
    dt.setHours(h, m);
  
    this.entretienService.modifierDateEntretien(
      entretienId,
      dt.toISOString(),
      fd.start,
      fd.end
    ).subscribe(() => {
      Swal.fire('Succès', 'Date de l\'entretien modifiée', 'success');
      this.eventModal?.hide();
      this.loadEntretiens();
    }, () => {
      Swal.fire('Erreur', 'Échec de la modification', 'error');
    });
  }
  
  
  
}
