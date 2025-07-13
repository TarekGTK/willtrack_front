import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component pages
import { StarterComponent } from "./starter/starter.component";
import { TimelineComponent } from "./timeline/timeline.component";
import { FaqsComponent } from "./faqs/faqs.component";
import { PricingComponent } from "./pricing/pricing.component";
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileSettingsComponent } from './profile-settings/profile-settings.component';
import { ContactsComponent } from './contacts/contacts.component';
import { TermConditionsComponent } from './term-conditions/term-conditions.component';


import {OfferComponent} from "./stage/offer/offer.component";
import {OfferStaffComponent} from "./stage/offerStaff/offer-Staff.component";
import {OfferUserComponent} from "./stage/offerUser/offer-User.component";
import {MesofferStaffComponent} from "./stage/mesofferStaff/mesoffer-Staff.component";
import {OfferUserPFEComponent} from "./stage/offerUserPFE/offer-UserPFE.component";
import {OfferUserJOBComponent} from "./stage/offerUserJOB/offer-UserJOB.component";
import {MesofferAdminComponent} from "./stage/mesofferAdmin/mesoffer-Admin.component";
import {OfferAdminComponent} from "./stage/offerAdmin/offer-Admin.component";
import {ApplicationComponent} from "./stage/application/application.component";

import { UsersComponent } from './stage/users/users.component';
import { RegroupementComponent } from './stage/regroupement/regroupement.component';
import { FiltercvComponent } from './stage/filtercv/filtercv.component';
import { PredictionsalaireComponent } from './stage/predictionsalaire/predictionsalaire.component';
import { CondidatComponent } from './stage/condidat/condidat.component';
import { RhComponent } from './stage/rh/rh.component';
import { RecrutementbiComponent } from './stage/recrutementbi/recrutementbi.component';
import { IntegrationbiComponent } from './stage/integrationbi/integrationbi.component';
import { PostintegrationbiComponent } from './stage/postintegrationbi/postintegrationbi.component';
import { RetentionComponent } from './stage/retention/retention.component';
import { RetentionRecrutementComponent } from './stage/retention-recrutement/retention-recrutement.component';


const routes: Routes = [

  {
    path: 'starter',
    component: StarterComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'profile-settings',
    component: ProfileSettingsComponent
  },
  {
    path: 'contacts',
    component: ContactsComponent
  },
  {
    path: 'timeline',
    component: TimelineComponent
  },
  {
    path: 'faqs',
    component: FaqsComponent
  },
  {
    path: 'pricing',
    component: PricingComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'term-conditions',
    component: TermConditionsComponent
  },
  {
    path: 'recruteur',
   component: UsersComponent

  },
  {
    path: 'condidat',
   component: CondidatComponent

  },
  {
    path: 'rh',
   component: RhComponent

  },

  {
    path: 'offer',
    component: OfferComponent

  },
  {
    path: 'offerStaff',
    component: OfferStaffComponent

  },
  {
    path: 'offerUser',
    component: OfferUserComponent

  },
  {
    path: 'offerUserPFE',
    component: OfferUserPFEComponent

  },
  {
    path: 'offerUserJOB',
    component: OfferUserJOBComponent

  },
  {
    path: 'mesofferStaff',
    component:  MesofferStaffComponent

  },
  {
    path: 'mesofferAdmin',
    component:  MesofferAdminComponent

  },
  {
    path: 'offerAdmin',
    component:  OfferAdminComponent
  },
  {
    path: 'applications',
    component:  ApplicationComponent
  },
  {
    path: 'regroupement',
    component:  RegroupementComponent
  },
  {
    path: 'filtercv',
    component:  FiltercvComponent
  },
  {
    path: 'prediction',
    component:  PredictionsalaireComponent
  },
  {
    path: 'recrutementbi',
    component:  RecrutementbiComponent
  },
  {
    path: 'integrationbi',
    component:  IntegrationbiComponent
  },
  {
    path: 'postintegrationbi',
    component:  PostintegrationbiComponent
  },
  {
    path: 'retention-recrutement',
    component:  RetentionRecrutementComponent
  },
   {
    path: 'retention-integration',
    component:  RetentionComponent
  },
 


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtraPagesRoutingModule { }
