import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Component
import { CalendarComponent } from './calendar/calendar.component';
import { ChatComponent } from './chat/chat.component';
import { EmailComponent } from './email/email.component';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { WidgetsComponent } from './widgets/widgets.component';
import { CalendarRhComponent } from './calendar-rh/calendar-rh.component';
import { CalendarCondidatComponent } from './calendar-condidat/calendar-condidat.component';
import { CalendarManagerComponent } from './calendar-manager/calendar-manager.component';
import { CalendarTechnicalComponent } from './calendar-technical/calendar-technical.component';

const routes: Routes = [
    {
        path: "calendar",
        component: CalendarComponent
    },
     {
        path: "calendar-technical",
        component: CalendarTechnicalComponent
    },
    {
        path: "calendar-manager",
        component: CalendarManagerComponent
    },
    {
        path: "calendar-condidat",
        component: CalendarCondidatComponent
    },
    {
        path: "calendar-rh",
        component: CalendarRhComponent
    },
    {
        path: "chat",
        component: ChatComponent
    },
    {
        path: "email",
        component: EmailComponent
    },
    {
        path: "file-manager",
        component: FileManagerComponent
    },
    {
        path: "widgets",
        component: WidgetsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppsRoutingModule { }
