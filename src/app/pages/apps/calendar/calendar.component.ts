import { Component, ViewChild, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CalendarOptions, EventApi, EventClickArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import Swal from 'sweetalert2';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { EntretienEventService } from 'src/app/core/services/entretien-event.service';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @ViewChild('eventModal', { static: false }) eventModal?: ModalDirective;

  calendarOptions!: CalendarOptions;
  calendarEvents: any[] = [];
  formData!: UntypedFormGroup;
  isEditMode = false;
  editEvent!: EventApi;
  newEventDate: any;
  submitted = false;
  applications: any[] = [];
  selectedStatus: string = 'ALL';
  entretiensAll: any[] = [];

  constructor(
    private fb: UntypedFormBuilder,
    private entretienService: EntretienEventService
  ) {}

  ngOnInit(): void {
    this.formData = this.fb.group({
      applicationId: ['', Validators.required],
      type: ['', Validators.required],
      location: ['', Validators.required],
      date: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
    });

    this.loadEntretiens();
  }

  loadEntretiens(): void {
    this.entretienService.getAllEntretiensWithApplications().subscribe(apps => {
      const entretiens = [];
      for (const app of apps) {
        const candidat = app.user;
        for (const entretien of app.entretienList || []) {
          entretiens.push({
            ...entretien,
            applicationId: app.id,
            candidatNom: candidat.nom + ' ' + candidat.prenom,
            photoUrl: candidat.photoProfilUrl,
            statusEntretien: entretien.statusEntretien
          });
        }
      }
      this.entretiensAll = entretiens;
      this.applications = apps;
      this.filterEvents();
    });
  }

  filterEvents(): void {
    const filtered = this.selectedStatus === 'ALL'
      ? this.entretiensAll
      : this.entretiensAll.filter(e => e.statusEntretien === this.selectedStatus);

    this.calendarEvents = filtered.map(entretien => ({
      id: entretien.id.toString(),
      title: `${entretien.typeEntretien} - ${entretien.statusEntretien}`,
      start: new Date(entretien.dateEntretien),
      end: new Date(entretien.dateEntretien),
      extendedProps: {
        location: entretien.lieu,
        description: `Application ID: ${entretien.applicationId}`
      },
      className: this.getColorClass(entretien.statusEntretien)
    }));

    this.initCalendar();
  }

  getColorClass(status: string): string {
    switch (status) {
      case 'PLANIFIE': return 'bg-warning';
      case 'ACCEPTE': return 'bg-success';
      case 'REFUSE': return 'bg-danger';
      default: return 'bg-primary';
    }
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
      events: this.calendarEvents,
      select: this.openModal.bind(this),
      eventClick: this.handleEventClick.bind(this),
      drop: (info) => this.handleDrop(info) // Handle the drag-and-drop action
    };
  }

  openModal(selectInfo: any): void {
    this.isEditMode = false;
    this.newEventDate = selectInfo;
    this.formData.reset();
    this.submitted = false;
    this.eventModal?.show();
  }

  handleEventClick(clickInfo: EventClickArg): void {
    this.isEditMode = true;
    this.editEvent = clickInfo.event;
    const start = clickInfo.event.start!;
    this.formData.patchValue({
      applicationId: clickInfo.event.extendedProps['description'].split(':')[1].trim(),
      type: clickInfo.event.title.split(' - ')[0],
      location: clickInfo.event.extendedProps['location'],
      date: start.toISOString().substr(0, 10),
      start: start.toTimeString().substr(0, 5),
      end: start.toTimeString().substr(0, 5)
    });
    this.eventModal?.show();
  }

  saveEvent(): void {
    this.submitted = true;
    if (this.formData.invalid) return;

    const fd = this.formData.value;
    const dt = new Date(fd.date);
    const [h, m] = fd.start.split(':').map(Number);
    dt.setHours(h, m);

    this.entretienService.planifierEntretien(
      fd.applicationId,
      fd.type,
      dt,
      fd.location
    ).subscribe(res => {
      Swal.fire('Succès', 'Entretien planifié', 'success');
      this.eventModal?.hide();
      this.loadEntretiens();
    }, () => Swal.fire('Erreur', 'Échec de planification', 'error'));
  }

  deleteEvent(): void {
    if (this.editEvent) {
      const id = this.editEvent.id;
      this.entretienService.annulerEntretien(id).subscribe(() => {
        Swal.fire('Annulé', 'Entretien supprimé', 'success');
        this.loadEntretiens();
        this.eventModal?.hide();
      });
    }
  }

  onStatusChange(): void {
    this.filterEvents();
  }

  filteredApplications(): any[] {
    if (this.selectedStatus === 'ALL') return this.applications;
    return this.applications.filter(app =>
      app.entretienList?.some((e: any) => e.statusEntretien === this.selectedStatus)
    );
  }

  getStatusForApplication(appId: number): string | null {
    const e = this.entretiensAll.find(e => e.applicationId === appId);
    return e ? e.statusEntretien : null;
  }

  handleDrop(info: any): void {
    const applicationId = info.event.extendedProps.description.split(':')[1].trim();
    const app = this.applications.find(app => app.id === Number(applicationId));

    
    if (app && app.status !== 'REFUSE') {
      
      this.saveEvent();
    } else {
      Swal.fire('Erreur', 'Vous ne pouvez pas planifier un entretien pour une candidature refusée.', 'error');
      info.revert();
    }
  }
}
